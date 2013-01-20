private var motor : CharacterMotor;

private var playerPlane : Plane;
private var ray : Ray;
private var hitdist = 0.0f;


private var moving = false;
public var speed = 25.0f;

// Use this for initialization
function Awake () {
	motor = GetComponent(CharacterMotor);
}

// Update is called once per frame
function Update () {

	if ( Input.GetMouseButton( 1 )) {
		
		// Generate a plane that intersects the transform's position with an upwards normal.
		playerPlane = new Plane(Vector3.up, transform.position);
		// Generate a ray from the cursor position
		ray = Camera.main.ScreenPointToRay ( Input.mousePosition );

		// Determine the point where the cursor ray intersects the plane.
	    // This will be the point that the object must look towards to be looking at the mouse.
	    // Raycasting to a Plane object only gives us a distance, so we'll have to take the distance,
	    //   then find the point along that ray that meets that distance.  This will be the point
	    //   to look at.
	    
	    // If the ray is parallel to the plane, Raycast will return false.
	    if (playerPlane.Raycast( ray, hitdist )) {
	    
			if ( Vector3.Distance( transform.position, ray.GetPoint( hitdist )) > 0.1 ) {
			
//				Debug.Log( "RayPoint is: " + ( ray.GetPoint( hitdist ) - transform.position ));
				moving = true;
				
			} else {
				
				moving = false;
				
			}

	    } else {

			moving = false;
			
		}
		
	}	
		
	// Get the point along the ray that hits the calculated distance.
	var directionVector : Vector3 = ( ray.GetPoint( hitdist ) - transform.position );
	//var directionVector = new Vector3( 0.5, 0, 0.5);
	
	var dist = Vector3.Distance( transform.position, directionVector );
	
	if ( moving && dist > 0.1 ) {

		if (directionVector != Vector3.zero) {
			// Get the length of the directon vector and then normalize it
			// Dividing by the length is cheaper than normalizing when we already have the length anyway
			var directionLength = directionVector.magnitude;
			directionVector = directionVector / directionLength;
			
			// Make sure the length is no bigger than 1
			directionLength = Mathf.Min(1, directionLength);
			
			// Make the input vector more sensitive towards the extremes and less sensitive in the middle
			// This makes it easier to control slow speeds when using analog sticks
			directionLength = directionLength * directionLength;
			
			// Multiply the normalized direction vector by the modified length
			directionVector = directionVector * directionLength;
		}

		// Apply the direction to the CharacterMotor
		motor.inputMoveDirection = transform.rotation * directionVector;
		
	} else {
	
		moving = false;
		hitdist = 0.0f;
		
	}

}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/TD Input Controller")
