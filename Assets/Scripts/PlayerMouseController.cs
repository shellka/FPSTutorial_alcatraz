using UnityEngine;
using System.Collections;

public class PlayerMouseController : MonoBehaviour {
	
	private Ray ray;
	private float hitdist = 18f;
	private NavMeshAgent nav;
	
	// Use this for initialization
	void Start () {
		this.nav = GetComponent<NavMeshAgent>( );
	}
	
	// Update is called once per frame
	void Update () {
		
		if ( Input.GetMouseButton( 1 )) { 
			
			/**if ( this.nav.remainingDistance > 0 ) {
				Debug.Log ( "already moving" );
				return;
			}**/
			
			this.ray = Camera.main.ScreenPointToRay ( Input.mousePosition );
			
			this.nav.enabled = true;
			//Debug.Log ("Ray is: " + ray.ToString( ));
			Debug.Log ("Ray point: " + this.ray.GetPoint( this.hitdist ));
			this.nav.SetDestination( this.ray.GetPoint( this.hitdist ));
			//this.nav.SetDestination( new Vector3( 874.1208f, 4.563694f, 700.4479f ));
			
		}
		
	}
}
