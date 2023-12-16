import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css'; 

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCameraPanel = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  useEffect(() => {
    const camera = document.getElementById('camera');
    const panel = document.getElementById('panel');

    if (camera && panel) {
      camera.addEventListener('click', () => {
        panel.classList.toggle('open');
        setIsOpen((prevIsOpen) => !prevIsOpen);
      });
    }
  }, []);

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>Welcome</IonTitle>
      </IonToolbar>
      <IonContent>
        <div className={`presentation-container ${isOpen ? 'open' : ''}`}>
          <h1 className="welcome-text">¡Bienvenido a la App Pokémon!</h1>
          <p className="intro-text">
            Explora el fascinante mundo de los Pokémon y descubre sus secretos.
          </p>
        </div>
        <div className='contentlink'>
          <a className="link" href="/Tab2"></a>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
