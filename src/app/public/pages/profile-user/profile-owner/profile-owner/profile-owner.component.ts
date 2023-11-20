import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {RegisterOwnerService} from "../../../../services/register-owner.service";
import {getDownloadURL, ref, Storage, uploadBytes} from "@angular/fire/storage";

@Component({
  selector: 'app-profile-owner',
  templateUrl: './profile-owner.component.html',
  styleUrls: ['./profile-owner.component.css']
})
export class ProfileOwnerComponent implements OnInit{
  user: any;
  imageprofile:any;
  userId: number | null;
  constructor(private storage: Storage,private route: ActivatedRoute, private userService: RegisterOwnerService) {
    this.userId = this.userService.getOwnerId();
  }
  profile = {imageUrl:'',ownerId:0};

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const userId = params['onid']; // Obtén el id del usuario de la URL
      this.userService.getUserById(userId).subscribe((data:any) => {
        this.user = data;

      });
    });
    this.route.params.subscribe((params) => {
      const userId = params['onid']; // Obtén el id del usuario de la URL
      this.userService.getimageprofile(userId).subscribe((data:any) => {
        this.imageprofile = data;

      });
    });

  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      console.log('Archivo seleccionado:', file.name);

      const storageRef = ref(this.storage, `imagesprofile/${file.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        this.profile.imageUrl = downloadURL;

        console.log('URL de descarga:', downloadURL);
      } catch (error) {
        console.error('Error al cargar el archivo en Firebase Storage:', error);
      }
    }
  }

  //Update de imagen de perfil
  onSubmitVehicule() {
    const ownerId = this.userService.getOwnerId();

    if (ownerId !== null) {
      this.profile.ownerId = ownerId;

      this.userService.updateimageprofile(this.profile).subscribe((data: any) => {
        console.log('Imagen de Perfil creada:', data.id);
      });
    } else {
      console.error('Error: ownerId es nulo');
    }


  }

}
