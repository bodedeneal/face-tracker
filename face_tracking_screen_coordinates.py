import cv2

# Screen dimensions (update these based on your screen resolution)
SCREEN_WIDTH = 1824
SCREEN_HEIGHT = 1050

# Load the pre-trained Haar cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Initialize webcam capture
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not access the camera.")
    exit()

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    
    if not ret:
        print("Error: Could not read frame from the camera.")
        break
    
    # Convert the frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the frame
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    for (x, y, w, h) in faces:
        # Calculate the center of the face
        face_center_x = x + w // 2
        face_center_y = y + h // 2
        
        # Map the face center to screen coordinates
        # Assuming the camera resolution matches the screen resolution
        screen_x = int((face_center_x / frame.shape[1]) * SCREEN_WIDTH)
        screen_y = int((face_center_y / frame.shape[0]) * SCREEN_HEIGHT)
        
        # Draw a rectangle around the face and display the coordinates
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        cv2.putText(frame, f"Screen Coordinates: ({screen_x}, {screen_y})", 
                    (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    # Display the resulting frame
    cv2.imshow('Face Tracking', frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
