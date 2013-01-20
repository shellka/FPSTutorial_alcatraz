using UnityEngine;
using System.Collections;

public class PlayerMouseController : MonoBehaviour {
	
	private Ray ray;
	private float hitdist = 0.0f;
	private NavMeshAgent nav;
	
	// Use this for initialization
	void Start () {
		this.nav = GetComponent<NavMeshAgent>( );
	}
	
	// Update is called once per frame
	void Update () {
		
		if ( Input.GetMouseButton( 1 )) { 
			
			this.ray = Camera.main.ScreenPointToRay ( Input.mousePosition );
			
			this.nav.enabled = true;
			this.nav.SetDestination( this.ray.GetPoint( this.hitdist ));
			
		}
		
	}
}
