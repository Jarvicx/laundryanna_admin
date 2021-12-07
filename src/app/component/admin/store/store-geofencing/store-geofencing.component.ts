import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import  Swal  from "sweetalert2";
declare const google: any;


@Component({
  selector: 'app-store-geofencing',
  templateUrl: './store-geofencing.component.html',
  styleUrls: ['./store-geofencing.component.css']
})
export class StoreGeofencingComponent implements OnInit {

  public storeData: any = '';
  
  public editable: boolean = false;
  pointList: { lat: number; lng: number }[] = [];
  selectedArea = 0;
  public locationList: any = [];
  public storeId: any = '';
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  });
  public options: any = {
    componentRestrictions:{
      country:["IN"]
    }
  }

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService,private _activate : ActivatedRoute, private _router : Router ) { }

  ngOnInit(): void {
    this.storeId = this._activate.snapshot.paramMap.get('storeId') || '';
    if(this.storeId) {
      this._loader.startLoader('loader');
      this._api.getStoreById(this.storeId).subscribe(
        res => {
          console.log("store detail", res);
          this.storeData = res.data;
          this.pointList = res.data?.geoFence;
          this._loader.stopLoader('loader')
        }
      )
    }
  }

  public AddressChange(address: any) {
    //setting address from API to local variable
    console.log("Google location:",address);
    this.storeData.lat = address.geometry.location.lat();
    this.storeData.lon = address.geometry.location.lng();
    
  }
  
  //from here map drawing code started
  onMapReady(map:any) {
    this.initDrawingManager(map);
    
  }

  initDrawingManager(map: any) {
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon"]
      },
      polygonOptions: {
        draggable: true,
        editable: true
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };

    const drawingManager = new google.maps.drawing.DrawingManager(options);
    drawingManager.setMap(map);

    google.maps.event.addListener(
      drawingManager,
      'overlaycomplete',
      (event:any) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON)    {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(
              paths.getAt(p),
              'set_at',
              () => {
                if (!event.overlay.drag) {
                  this.updatePointList(event.overlay.getPath());
                }
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'insert_at',
              () => {
                this.updatePointList(event.overlay.getPath());
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'remove_at',
              () => {
                this.updatePointList(event.overlay.getPath());
              }
            );
          }
          this.updatePointList(event.overlay.getPath());
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          drawingManager.setDrawingMode(null);
          // To hide:
          drawingManager.setOptions({
            drawingControl: false,
          });
        }
      }
    );
  }
  
  updatePointList(path : any) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(
        path.getAt(i).toJSON()
      );
    }
    this.selectedArea = google.maps.geometry.spherical.computeArea(
      path
    );
    console.log(this.pointList, this.selectedArea);
    
  }
  //map drawng end here

  abc(path: any){
    console.log(path);
    
  }

  storeFormSubmit() {
    if (this.pointList.length >= 3) {
      let mainForm = {
        geoFence: this.pointList
      }
      this._api.updateStore(this.storeId, mainForm).subscribe(
        res => {
          this.Toast.fire({
            icon: 'success',
            title: 'Geo fencing added successfully'
          })
          this._router.navigate(['/admin/store/list']);
          this._loader.stopLoader('loader');

        }, err => {
          this.Toast.fire({
            icon: 'error',
            title: 'Operation failed'
          })
          this._loader.stopLoader('loader');
        }
      )
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Choose at lest three coordinates'
      })
      this._loader.stopLoader('loader');
    }
  }

  editFencing() {
    this.pointList = [];
    this.editable = true;
  }

  

}
