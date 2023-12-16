// src/pages/Tab2.tsx
import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton, IonRefresher, IonRefresherContent } from '@ionic/react';
import axios from 'axios';
import { useSpring, animated } from 'react-spring';
import './Tab2.css';

interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonStat {
  base_stat: number;
}

interface PokemonSprite {
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
}

interface Pokemon {
  id: number;
  name: string;
  img: string;
  attack: number;
  weight: number;
  height: number;
  types: string[];
}

const itemsPerPage = 9;

const Tab2: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ionContentRef = useRef<HTMLIonContentElement>(null);

  const [props, set] = useSpring(() => ({
    opacity: 1,
    transform: 'translateY(0)',
  }));

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    set({
      opacity: scrollPosition < 100 ? 1 : 0,
      transform: `translateY(${scrollPosition / 2}px)`,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${400}`);
        const results = apiUrl.data.results;

        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        const paginatedResults = results.slice(startIdx, endIdx);

        const pokemonPromises = paginatedResults.map(async (result: any) => {
          const pokes = await axios.get(result.url);
          const pokeInfo = pokes.data;

          const types: string[] = pokeInfo.types.map((t: PokemonType) => t.type.name);
          const attack: number = pokeInfo.stats.find((stat: any) => stat.stat.name === 'attack').base_stat;

          const img: string = pokeInfo.sprites.versions["generation-v"]["black-white"].animated.front_default;

          return {
            id: pokeInfo.id,
            name: pokeInfo.name,
            img,
            attack,
            weight: pokeInfo.weight,
            height: pokeInfo.height,
            types,
          };
        });

        const fetchedPokemon = await Promise.all(pokemonPromises);

        setPokemonList(fetchedPokemon);
        setTotalPages(Math.ceil(results.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages && ionContentRef.current) {
      setCurrentPage(currentPage + 1);
      ionContentRef.current.scrollToTop();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && ionContentRef.current) {
      setCurrentPage(currentPage - 1);
      ionContentRef.current.scrollToTop();
    }
  };

  return (
    <IonPage>
      <IonToolbar>
        <IonTitle>Colección Pokémon</IonTitle>
      </IonToolbar>
      <IonContent ref={ionContentRef}>
        <div className="pokemon-container">
          {pokemonList.map((pokemon) => (
            <animated.div key={pokemon.id} className={`pokemon-card ${pokemon.types[0].toLowerCase()}`} style={props}>
              <IonCardHeader>
                <IonCardSubtitle>{pokemon.types.join(', ')}</IonCardSubtitle>
                <IonCardTitle>{pokemon.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="pokemon-details">
                <img src={pokemon.img} alt={pokemon.name} className="pokemon-image" />
                <p>Ataque: {pokemon.attack}</p>
                <p>Peso: {pokemon.weight}</p>
                <p>Altura: {pokemon.height}</p>
              </IonCardContent>
            </animated.div>
          ))}
        </div>
        <div className="pagination">
          <IonButton className='IonTabButton' onClick={handlePrevPage} disabled={currentPage === 1}>
            Anterior
          </IonButton>
          <span className="page-info">{currentPage} de {totalPages}</span>
          <IonButton className='IonTabButton' onClick={handleNextPage} disabled={currentPage === totalPages}>
            Siguiente
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
