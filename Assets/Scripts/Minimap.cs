using UnityEngine;
using System.Collections;
 
public class Minimap : MonoBehaviour
{
    public Texture2D BlipTex;
 
    public GameObject Player;
 
    private void OnGUI()
    {
        var objPos = camera.WorldToViewportPoint(Player.transform.position);
 
        GUI.DrawTexture(new Rect(
            Screen.width * (camera.rect.x + (objPos.x*camera.rect.width)) - 2,
            Screen.height * (1-(camera.rect.y + (objPos.y*camera.rect.height))) - 2,
            4, 4), BlipTex);
    }
}