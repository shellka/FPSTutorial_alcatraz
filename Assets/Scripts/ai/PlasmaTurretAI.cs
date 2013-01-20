using System.Collections.Generic;
using System.Linq;
using UnityEngine;

//Имя класса ОБЯЗАТЕЛЬНО должно совпадать с именем файла, а наследование от MonoBehaviour необходимо для возможности "натянуть" скрипт на любой GameObject (ну и не только для этого).
[RequireComponent(typeof(AudioSource))]
public class PlasmaTurretAI : MonoBehaviour
{
   public GameObject[] targets; //массив всех целей
   public GameObject curTarget;
   public float towerPrice = 100.0f;
   public float attackMaximumDistance = 50.0f; //дистанция атаки
   public float attackMinimumDistance = 5.0f;
   public float attackDamage = 10.0f; //урон
   public float reloadTimer = 2.5f; //задержка между выстрелами, изменяемое значение
   public const float reloadCooldown = 2.5f; //задержка между выстрелами, константа
   public float rotationSpeed = 1.5f; //множитель скорости вращения башни
   public int FiringOrder = 1; //очередность стрельбы для стволов (у нас же их 2)

   private Transform turretHead;
	
   public LineRenderer laserPrefab;
   private LineRenderer laserL;		// Left Eye Laser Line Renderer
   private LineRenderer laserR;		// Right Eye Laser Line Renderer
	private Transform EyeL;				// Left Eye position transform
	private Transform EyeR;				// Right Eye position transform
	
	private bool shot = false;

   public RaycastHit Hit;

   //используем этот метод для инициализации
   private void Start() {
		turretHead = transform.Find("pushka"); //находим башню в иерархии частей модели
		laserL = new LineRenderer();
		laserR = new LineRenderer();
		
		// initialising eye positions
		EyeL = turretHead.Find("ShootSpawnL");
		EyeR = turretHead.Find("ShootSpawnR");
		
		// setting up the audio component
		audio.loop = true;
		audio.playOnAwake = false;
   }

   //а этот метод вызывается каждый фрейм
   private void Update()
   {
      if (curTarget != null) //если переменная текущей цели не пустая
      {
         float distance = Vector3.Distance(turretHead.position, curTarget.transform.position); //меряем дистанцию до нее
			
         if (attackMinimumDistance < distance && distance < attackMaximumDistance) { //если дистанция больше мертвой зоны и меньше дистанции поражения пушки
            turretHead.rotation = Quaternion.Slerp(turretHead.rotation, Quaternion.LookRotation(curTarget.transform.position - turretHead.position), rotationSpeed * Time.deltaTime); //вращаем башню в сторону цели
				
			if(laserL != null) {
				// set positions for our line renderer objects to start at the eyes and end at the enemy position, registered in the bot control script
				laserL.SetPosition(0, EyeL.position);
				laserL.SetPosition(1, curTarget.transform.position);
				laserR.SetPosition(0, EyeR.position);
				laserR.SetPosition(1, curTarget.transform.position);
			}
				
            if (reloadTimer > 0) reloadTimer -= Time.deltaTime; //если таймер перезарядки больше нуля - отнимаем его
            if (reloadTimer < 0) reloadTimer = 0; //если он стал меньше нуля - устанавливаем его в ноль
            if (reloadTimer == 0) //став нулем
            {
               MobHP mhp = curTarget.GetComponent<MobHP>();
               switch (FiringOrder) //смотрим, из какого ствола стрелять
               {
                  case 1:
                     if (mhp != null) mhp.ChangeHP(-attackDamage); //наносим дамаг цели
                     FiringOrder++; //увеличиваем FiringOrder на 1
                     break;
                  case 2:
                     if (mhp != null) mhp.ChangeHP(-attackDamage); //наносим дамаг цели
                     FiringOrder = 1; //устанавливаем FiringOrder в изначальную позицию
                     break;
               }
					
				// instantiate our two lasers
				if ( laserL ) 
					Destroy(laserL);
				laserL = Instantiate(laserPrefab) as LineRenderer;
				if ( laserR ) 
					Destroy(laserR);
				laserR = Instantiate(laserPrefab) as LineRenderer;
				
				// register that we have shot once
				shot = true;
				// play the laser beam effect
				audio.Play( );
					
				// if our laser line renderer objects exist..
					
               reloadTimer = reloadCooldown; //возвращаем переменной задержки её первоначальное значение из константы
            }
         } else {
		    audio.Stop();
			if ( laserL ) 
				Destroy(laserL);
			if ( laserR ) 
					Destroy(laserR);
			curTarget = SortTargets(); //сортируем цели и получаем новую
		 }

        } else {
			audio.Stop();
			if ( laserL ) 
				Destroy(laserL);
			if ( laserR ) 
					Destroy(laserR);
			curTarget = SortTargets(); //сортируем цели и получаем новую
		}
   }

   //Очень примитивный метод сортировки целей, море возможностей для модификации!
   public GameObject SortTargets()
   {
      float closestMobDistance = 0; //инициализация переменной для проверки дистанции до моба
      GameObject nearestmob = null; //инициализация переменной ближайшего моба
      List<GameObject> sortingMobs = GameObject.FindGameObjectsWithTag("Enemy").ToList(); //находим всех мобов с тегом Monster и создаём массив для сортировки

      foreach (var everyTarget in sortingMobs) //для каждого моба в массиве
      {
         //если дистанция до моба меньше, чем closestMobDistance или равна нулю
         if ((Vector3.Distance(everyTarget.transform.position, turretHead.position) < closestMobDistance) || closestMobDistance == 0)
         {
            closestMobDistance = Vector3.Distance(everyTarget.transform.position, turretHead.position); //Меряем дистанцию от моба до пушки, записываем её в переменную
            nearestmob = everyTarget;//устанавливаем его как ближайшего
         }
      }
      return closestMobDistance > attackMaximumDistance ? null : nearestmob; //возвращаем ближайшего моба
   }
}