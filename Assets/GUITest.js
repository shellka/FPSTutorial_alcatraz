@script ExecuteInEditMode
#pragma strict

var button: Rect;
var label: Rect;
var window: Rect;

var guiSkin: GUISkin;

function onGUI() {

	GUI.skin = guiSkin;
	
	if ( GUI.Button( button, "GUI Button" )) {
	
		Debug.Log( "Button pressed" );
	
	}

}

function Start () {

}

function Update () {

}