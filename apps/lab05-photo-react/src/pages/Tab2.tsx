// CHANGE: Add the following import
import { camera } from 'ionicons/icons';
// CHANGE: Update the following import
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonLabel, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
// CHANGE: Remove or comment out `ExploreContainer`
// import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import { usePhotoGallery } from '../hooks/usePhotoGallery';



const Tab2: React.FC = () => {
  const { photos, addNewToGallery } = usePhotoGallery();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
          <IonTitle size="small">Lab 05 - โดย นายวีรภัทร แก้วคำลา 663380024-9</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
            <IonTitle size="small">Lab 05 - โดย นายวีรภัทร แก้วคำลา 663380024-9</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            {/* CHANGE: Create a new column and image component for each photo */}
            {photos.map((photo) => (
              <IonCol size="6" key={photo.filepath}>
                <IonImg src={photo.webviewPath} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>


        {/* CHANGE: Add the floating action button */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => addNewToGallery()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>


        {/* CHANGE: Remove or comment out `ExploreContainer` */}
        {/* <ExploreContainer name="Tab 2 page" /> */}
      </IonContent>
    </IonPage>
  );
};


export default Tab2;


