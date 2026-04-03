from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import shutil
import os
from deepface import DeepFace
from identify import faceDetection, faceRecognition, setKnownName, setFacesToZero

app = FastAPI(title="Face Recognition API")

@app.post("/recognize")
async def recognize_faces(file: UploadFile = File(...)):
    """
    Upload an image to detect and recognize faces.
    Returns the total count of faces and the names of recognized individuals.
    """
    # Create temp directory if not exists
    os.makedirs("./temp", exist_ok=True)
    temp_path = f"./temp/{file.filename}"
    
    # Save uploaded file temporarily
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Reset global state in identify.py before processing
        setKnownName()
        setFacesToZero()
        
        # Run detection and recognition
        total_faces = faceDetection(temp_path)
        names = faceRecognition(temp_path)
        
        return {
            "total_faces": total_faces,
            "recognized_names": names,
            "status": "success"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/add-voter")
async def add_voter(name: str = Form(...), file: UploadFile = File(...)):
    """
    Add a new voter to the face recognition database.
    Stores the uploaded image directly in the database folder.
    """
    os.makedirs("./database", exist_ok=True)
    os.makedirs("./temp", exist_ok=True)
    
    temp_path = f"./temp/{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        total_faces = faceDetection(temp_path)
        
        if total_faces == 0:
            return {"status": "error", "message": "No face detected in the image"}
        
        if total_faces > 1:
            return {"status": "error", "message": "Multiple faces detected. Please upload an image with only one face"}
        
        cropped_faces_dir = "./faces/"
        if os.path.exists(cropped_faces_dir):
            face_files = [f for f in os.listdir(cropped_faces_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
            if face_files:
                face_path = os.path.join(cropped_faces_dir, face_files[0])
                
                destination_path = os.path.join("./database", f"{name}.jpg")
                shutil.copy(face_path, destination_path)
                
                return {
                    "status": "success",
                    "message": f"Voter '{name}' added successfully",
                    "name": name
                }
        
        return {"status": "error", "message": "Face extraction failed"}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/verify-user")
async def verify_user(file: UploadFile = File(...)):
    """
    Verify if a user exists in the database.
    Compares the uploaded image against stored faces.
    """
    os.makedirs("./temp", exist_ok=True)
    temp_path = f"./temp/{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        total_faces = faceDetection(temp_path)
        
        if total_faces == 0:
            return {
                "status": "success",
                "exists": False,
                "message": "No face detected in the image"
            }
        
        cropped_faces_dir = "./faces/"
        if os.path.exists(cropped_faces_dir):
            face_files = [f for f in os.listdir(cropped_faces_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
            if face_files:
                face_path = os.path.join(cropped_faces_dir, face_files[0])
                
                result = DeepFace.find(
                    img_path=face_path,
                    db_path="database",
                    enforce_detection=False,
                    model_name="GhostFaceNet"
                )
                
                if result and len(result[0]['identity']) > 0:
                    identity_path = result[0]['identity'].iloc[0]
                    name = identity_path.replace('\\', '/').split('/')[1]
                    
                    return {
                        "status": "success",
                        "exists": True,
                        "name": name,
                        "message": f"User '{name}' found in database"
                    }
        
        return {
            "status": "success",
            "exists": False,
            "message": "User not found in database"
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    import uvicorn
    # To run: python api.py
    uvicorn.run(app, host="0.0.0.0", port=8000)
