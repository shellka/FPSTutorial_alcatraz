var playerName : String;
var adjustment : float= 2.3f;
var maxHealth : float= 100;
var health : float = 100;
var healthTex: Texture;

private var worldPosition : Vector3= new Vector3();
private var screenPosition : Vector3= new Vector3();
private var myTransform : Transform;
private var myCamera : Camera;
private var healthBarHeight : int= 5;
private var healthBarLeft : int= 110;
private var barTop : int= 1;
private var healthBarLength : float= 100;
private var labelTop : int= 18;
private var labelWidth : int= 110;
private var labelHeight : int= 15;

private var myStyle : GUIStyle= new GUIStyle();
private var draw : boolean= false;

function Awake () {
	myTransform = transform;
	myCamera = Camera.main;
	myStyle.normal.textColor = Color.green;
	myStyle.fontSize = 12;
	myStyle.fontStyle = FontStyle.Bold;
	myStyle.clipping = TextClipping.Overflow;
}
function Update () {

	healthBarLength = (health /maxHealth) * 100;

}

function OnGUI () {

	//if (!draw) return;

	worldPosition = new Vector3(myTransform.position.x, myTransform.position.y + adjustment, myTransform.position.z);
	screenPosition = myCamera.WorldToScreenPoint(worldPosition);
	
	GUI.Box(new Rect(screenPosition.x - healthBarLeft / 2, 
		Screen.height - screenPosition.y - barTop,
		100, healthBarHeight), "");
	GUI.DrawTexture(new Rect(screenPosition.x - healthBarLeft / 2,
		Screen.height - screenPosition.y - barTop,
		healthBarLength, healthBarHeight), healthTex);
	GUI.Label(new Rect(screenPosition.x - labelWidth / 2,
		Screen.height - screenPosition.y - labelTop,
		labelWidth, labelHeight), playerName, myStyle);
}

function OnBecameVisible () {

	//draw = true;

}

function OnBecameInvisible () {

	//draw = false;

}