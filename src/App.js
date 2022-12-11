import './App.css';
import YUGIOHCards from './cards.js';
import * as React from 'react';
import * as Router from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

const getDefaultCards = () => {
  const list = YUGIOHCards.data
    .filter(card =>
      card.card_sets != null && (
        card.card_sets.filter(cardset => cardset.set_name == 'Legend of Blue Eyes White Dragon').length > 0
        || card.card_sets.filter(cardset => cardset.set_name == 'Starter Deck: Kaiba').length > 0
        || card.card_sets.filter(cardset => cardset.set_name == 'Starter Deck: Yugi').length > 0)
    ).map((card, index) =>           {
      return (
        { ID: card.id, name:          card.name, imgID: card.card_images.sort((a, b) => a.id < b.id ? -1 : 1)[0].id, card_detail: card}
      )
    }).sort((a, b) => a.ID < b.ID ? -1 : 1);
  return [...list];
}

const defaultCards = [...getDefaultCards()];

const getDefaultCardsPacks = () => {
  const list = [buildCardPack('1', 'Legend of Blue Eyes White Dragon', '89631139'), buildCardPack('2', 'Starter Deck: Kaiba', '89631139'), buildCardPack('3', 'Starter Deck: Yugi', '36996508')];
  return [...list];
}

const buildCardPack = (packID, packName, imageID) => {
  const card = defaultCards.find(card => card.card_detail.card_sets != null && card.card_detail.card_sets.find(card_set => card_set.set_name == packName));
  const cardPack = card.card_detail.card_sets.find(card_set => card_set.set_name == packName);
  return { ID: packID, cardPack, packImg: imageID };
}

const defaultCardsPacks = [...getDefaultCardsPacks()];

function App() {
  console.log('App Running');
  let { packID } = Router.useParams();
  const [cardList, setCardList] = React.useState(defaultCards);
  const [cardPacks, setCardPacks] = React.useState(defaultCardsPacks);
  const getCardPack = (param) => {
    const list = cardPacks.filter(cardPack => cardPack.ID == param);
    return [...list];
  }
  const constructCardPack = (param) => {
    const list = cardPacks.filter(cardPack => cardPack.ID == param);
    return [...list];
  }

  return (
    <Router.BrowserRouter>
      <React.Fragment>
        <CssBaseline />
        <div className='base-div'>
          <div className='container-div'>
            <AppBar position='static'>
              <Toolbar className='action-bar' sx={{ bgcolor: 'rgb(38 43 50)', color: 'rgba(255, 255, 255, 0.7)' }}>
                <Stack direction='row' spacing={4}>
                  <Router.Link to='/' className='no-deco'>
                    <Button>HOME</Button>
                  </Router.Link>
                  <Router.Link to='/cardpacks' className='no-deco'>
                    <Button>Card Packs</Button>
                  </Router.Link>
                  <Router.Link to='/cardlist' className='no-deco'>
                    <Button>Card List</Button>
                  </Router.Link>
                </Stack>
              </Toolbar>
            </AppBar>
            <div className='main-div'>
              <Router.Routes>
                <Router.Route path='/' element={<HomePage />} />
                <Router.Route path='/cardpacks' element={<CardPacks cardPacks={cardPacks} />} />
                <Router.Route path='/cardlist/:packID' element={<CardList cardList={cardList} getCardPack={getCardPack} />} />
                <Router.Route path='/cardlist/addpack/:packID' element={<CardSelection cardList={cardList} constructCardPack={constructCardPack} />} />
                <Router.Route path='/cardlist' element={<CardList cardList={cardList} cardPack={null} />} />
              </Router.Routes>
            </div>
          </div>
        </div>
      </React.Fragment>
    </Router.BrowserRouter>
  );
}

function HomePage() {
  return (
    <div className='sub-div'>
      <div className='main-row'>
        <img src={'/images/logo.png'} width={'50%'}></img>
      </div>
    </div>
  )
}

function CardPacks(props) {
  const cardPacks = props.cardPacks;
  const cardBack = { packImg: 'CardBack', cardPack: { set_name: 'Add New Packs' } }
  return (
    <div className='sub-div'>
      <div className='main-row'>
        <p>Total No of Packs Available: {cardPacks.length}</p>
        <div className='sub-div-row'>
          {
            cardPacks.map((cardPack, index) => {
              return (
                <Router.Link to={`/cardlist/${cardPack.ID}`} key={index} className='no-deco'>
                  <CardPack cardPack={cardPack}></CardPack>
                </Router.Link>
              )
            })
          }
          <Router.Link to={`/cardlist/addpack/${cardPacks.length + 1}`} className='no-deco'>
            <CardPack cardPack={cardBack}></CardPack>
          </Router.Link>
        </div>
      </div>
    </div>
  )
}

function CardPack(props) {
  const cardPack = props.cardPack;
  return (
    <Paper className='paper-div' elevation={5}>
      <img src={`/images/${cardPack.packImg}.jpg`} width={'180px'}></img>
      <p>{cardPack.cardPack.set_name}</p>
    </Paper>
  )
}

function CardList(props) {
  let packID = Router.useParams().packID;
  const cardPack = packID != null ? props.getCardPack(packID) : null;
  const cardList = cardPack != null && cardPack.length > 0 ? props.cardList.filter(card => card.card_detail.card_sets.filter(cardset => cardset.set_name == cardPack[0].cardPack.set_name).length > 0) : props.cardList;
  return (
    <div className='sub-div'>
      <div className='main-row'>
        <p>Total No of Cards: {cardList.length}</p>
        <div className='sub-div-row'>
          {
            cardList.map((card, index) => {
              return (
                <Card key={index} card={card}></Card>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function Card(props) {
  const card = props.card;
  return (
    <Paper className='paper-div' elevation={5}>
      <img src={`/images/${card.imgID}.jpg`} width={'180px'}></img>
      <p>{card.name}</p>
    </Paper>
  )
}

function CardSelection(props) {
  let packID = Router.useParams().packID;
  const [newPackID, setNewPackID] = React.useState(packID);
  const [selectedCardList, setSelectedCardList] = React.useState([]);
  const cardList = props.cardList;
  const selectedCard = (cardID, add) => {
    const newList = add ? [...selectedCardList, cardID] : [...selectedCardList.filter(id => id != cardID)];
    setSelectedCardList(newList);
  }
  const dothis = (cardID, add) => {
    console.log('click')
  }
  return (
    <div className='sub-div'>
      <div className='main-row'>
        <div to='/' className='no-deco'>
          <Button onClick={dothis}>CONFIRM PACK</Button>
        </div>
        <p>No of Cards Selected: {selectedCardList.length}</p>
        <div className='sub-div-row'>
          {
            cardList.map((card, index) => {
              return (
                <CardSelect key={index} card={card} selectedCard={selectedCard}></CardSelect>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function CardSelect(props) {
  const [active, setActive] = React.useState(false);
  const card = props.card;
  const selectedCard = (cardID) => {
    props.selectedCard(cardID, !active);
    setActive(!active);
  }
  return (
    <span className={active ? 'active' : ''} onClick={() => { selectedCard(card.ID) }}>
      <Paper className='paper-div' elevation={5}>
        <img src={`/images/${card.imgID}.jpg`} width={'180px'}></img>
        <p>{card.name}</p>
      </Paper>
       </span>
  )
}

export default App;