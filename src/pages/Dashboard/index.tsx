import {  useEffect, useState } from 'react';

import {Header} from '../../components/Header';
import api from '../../services/api';
import {Food} from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import {foodProps} from '../../components/Food';

export function Dashboard(){
    const [food, setState] = useState<foodProps[]>([])
    const [editingFood, setEditingFood] = useState<foodProps>({} as foodProps)
    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, seteditModalOpen] = useState(false)
     
   
  useEffect( () => {
    async function fetchFoods(){
       const response =  await api.get('/foods');
        setState(response.data);
    }
    fetchFoods()
  },[])

  async function handleAddFood (food:foodProps){   
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setState((prev) => [...prev, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food:foodProps){
   
    try {
      const foodUpdated = await api.put<foodProps>(
        `/foods/${editingFood.id}`,
      { ...editingFood, ...food },
      );
    
      setState((prev) => [...prev, foodUpdated.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id:number){
 
    await api.delete(`/foods/${id}`);

    const foodsFiltered = food.filter(food => food.id !== id);

    setState(foodsFiltered);
  }

  const toggleModal = () => setModalOpen(!modalOpen );
  

  const toggleEditModal = () => seteditModalOpen( !editModalOpen);
 

  const handleEditFood = (food:foodProps) =>{
     setEditingFood(food);
     seteditModalOpen(true)
  }

  

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {food &&
            food.map(food =>( 
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }

