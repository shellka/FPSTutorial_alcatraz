#pragma strict

var _menuMode : boolean = false;
var _gameMode : boolean = true;
var _optionsMode : boolean = false;

var btnResume: Rect;
var btnOptions: Rect;
var btnExit: Rect;

var guiSkin: GUISkin;

function Start () {

}

function Update () {

	if ( Input.GetButton( "Exit" )) {
	
		var _changed = false;
	
		if ( _gameMode && !_optionsMode && !_menuMode ) {
			// В игре - попадаем в меню
		
			_menuMode = true;
			_optionsMode = false;
			_gameMode = false;
			_changed = true;
		
		} else if ( !_gameMode && !_optionsMode && _menuMode && 1 == 3 ) {
			// В Меню - попадаем в игру
		
			_menuMode = false;
			_optionsMode = false;
			_gameMode = true;
			_changed = true;
		
		} else if ( !_gameMode && _optionsMode && !_menuMode ) {
			// В опциях - попадаем в меню
		
			_menuMode = true;
			_optionsMode = false;
			_gameMode = false;
			_changed = true;
		
		}

		if ( _changed )
			updateSettings();

	}
	
}

function OnGUI() {
	
	GUI.skin = guiSkin;
	
	if ( _menuMode ) {
	
		if ( GUI.Button( btnResume, "Resume" )) {
		
			_gameMode = true;
			_menuMode = false;
			_optionsMode = false;
			
			updateSettings();
			
		
		}
		
		if ( GUI.Button( btnExit, "Exit game" )) {
		
			Application.Quit();
			return;
			
		
		}
		
		if ( GUI.Button( btnOptions, "Options" )) {
		
			_gameMode = false;
			_menuMode = false;
			_optionsMode = true;
			
			updateSettings();
			
		
		}
	
	}

}

function updateSettings ( ) {

	var _mc = GameObject.Find("Main Camera");
	var _fpc = GameObject.Find("First Person Controller");
	
	if ( _mc && _fpc ) {
	
		var _m  = _mc.GetComponent("MouseLook");
		var _f = _fpc.GetComponent("MouseLook");
	
		//_m.active = _gameMode;
		//_f.active = _gameMode;
		//_fpc.active = _gameMode;
		_fpc.SetActive( _gameMode );
	
	}

	if ( _gameMode ) {
	
		Time.timeScale = 1;	// Возвращаем игру
		active = false;
	
	} else {
	
		Time.timeScale = 0;	// Останавливаем игру
	
	}

}