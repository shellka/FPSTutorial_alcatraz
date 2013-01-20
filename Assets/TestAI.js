#pragma strict

private var nav: NavMeshAgent;
private var target: Transform;
private var targetBase: Transform;

var _checkDistance: float = 100f;
var _checkBaseDistance: float = 200f;
var _attackDistance: float = 3.0f;
var _attackDistanceBase: float = 10.0f;

//var idleAnimation: AnimationClip;
//var walkAnimation: AnimationClip;
//var attackAnimation: AnimationClip;

public var lookWeight: float;
public var animSpeed: float = 1f;				// a public setting for overall animator animation speed
public var lookSmoother: float = 3f;				// a smoothing setting for camera motion
public var useCurves: boolean = false;						// a setting for teaching purposes to show use of curves

private var anim: Animator;							// a reference to the animator on the character
private var currentBaseState: AnimatorStateInfo;			// a reference to the current state of the animator, used for base layer
private var layer2CurrentState: AnimatorStateInfo;	// a reference to the current state of the animator, used for layer 2


static var idleState: int = Animator.StringToHash("Base Layer.Idle");	
static var locoState: int = Animator.StringToHash("Base Layer.Locomotion");			// these integers are references to our animator's states
static var jumpState: int = Animator.StringToHash("Base Layer.Jump");				// and are used to check state for various actions to occur
static var jumpDownState: int = Animator.StringToHash("Base Layer.JumpDown");		// within our FixedUpdate() function below
static var fallState: int = Animator.StringToHash("Base Layer.Fall");
static var rollState: int = Animator.StringToHash("Base Layer.Roll");
static var waveState: int = Animator.StringToHash("Layer2.Wave");

private var lastFramePosition: Vector3;

private var mob: Transform; //переменная для трансформа моба
//private var gv: GlobalVars; //поле для объекта глобальных переменных

public var mobPrice:float = 5.0f; //цена за убийство моба

function Awake() {
//      gv = GameObject.Find("Global Vars").GetComponent(GlobalVars); //инициализируем поле
      mob = transform; //присваиваем трансформ моба в переменную (повышает производительность)
   }

function Start () {

	target = GameObject.FindGameObjectWithTag( 'Player' ).transform;
	targetBase = GameObject.FindGameObjectWithTag( 'PlayerBase' ).transform;
	nav = GetComponent( NavMeshAgent );
	
	//animation.AddClip( idleAnimation, 'Idle' );
	//animation.AddClip( walkAnimation, 'walk' );
	//animation.AddClip( attackAnimation, 'attack' );
	
	anim = GetComponent( Animator );					  
	
	if ( anim.layerCount == 2 )
		anim.SetLayerWeight(1, 1);
	
}

function FixedUpdate () {

	if( anim.layerCount == 2 ) {		
		layer2CurrentState = anim.GetCurrentAnimatorStateInfo(1);	// set our layer2CurrentState variable to the current state of the second Layer (1) of animation
	}
	
	var distanceToBase: float = Vector3.Distance( transform.position, targetBase.transform.position );
	var distanceToPlayer: float = Vector3.Distance( transform.position, target.transform.position );

	var currentFramePosition : Vector3 = transform.position;
	var distance : float = Vector3.Distance(lastFramePosition, currentFramePosition);
	var currentSpeed: float = Mathf.Abs(distance)/Time.deltaTime;

	if ( distanceToBase < _checkBaseDistance ) {
	
		if ( distanceToBase > _attackDistanceBase ) {
		
			nav.enabled = true;
			nav.SetDestination( targetBase.position );
			
			lastFramePosition = currentFramePosition;

			anim.SetFloat("Speed", 1);							// set our animator's float parameter 'Speed' equal to the vertical input axis				
			anim.SetFloat("Direction", Vector3.Angle( lastFramePosition, currentFramePosition )); 						// set our animator's float parameter 'Direction' equal to the horizontal input axis		
			anim.speed = animSpeed;								// set the speed of our animator to the public variable 'animSpeed'
			anim.SetLookAtWeight(lookWeight);					// set the Look At Weight - amount to use look at IK vs using the head's animation
			currentBaseState = anim.GetCurrentAnimatorStateInfo(0);	// set our currentState variable to the current state of the Base Layer (0) of animation
		
		} else {

			nav.enabled = false;
			anim.SetBool("Wave", true);
			anim.SetFloat( "Speed", 0 );

		}
	
	} else if ( distanceToPlayer < _checkDistance ) {
	
		if ( distanceToPlayer > _attackDistance ) {

			nav.enabled = true;
			nav.SetDestination( target.position );
			
			lastFramePosition = currentFramePosition;
			
			anim.SetFloat("Speed", 1);							// set our animator's float parameter 'Speed' equal to the vertical input axis				
			anim.SetFloat("Direction", Vector3.Angle( lastFramePosition, currentFramePosition )); 						// set our animator's float parameter 'Direction' equal to the horizontal input axis		
			anim.speed = animSpeed;								// set the speed of our animator to the public variable 'animSpeed'
			anim.SetLookAtWeight(lookWeight);					// set the Look At Weight - amount to use look at IK vs using the head's animation
			currentBaseState = anim.GetCurrentAnimatorStateInfo(0);	// set our currentState variable to the current state of the Base Layer (0) of animation
			
		
		} else {
		
			nav.enabled = false;
			anim.SetBool("Wave", true);
			anim.SetFloat( "Speed", 0 );
		
		}
	
	} else {
	
		//animation.CrossFade( 'Idle' );
		nav.enabled = false;
		anim.SetFloat( "Speed", 0 );
	
		// if we enter the waving state, reset the bool to let us wave again in future
		if ( layer2CurrentState.nameHash == waveState ) {

			anim.SetBool("Wave", false);

		}
	
	}

}