import Header from '../components/header'
import Playlist from '../components/playlist'
import Song from '../components/song'

import './style.css'

import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'

//const Visualisation = dynamic(import('../components/visualisation'));

const Index = () => (
    <div className="musicPlayer">
        
        <Head>
            <title>Music Player</title>            
        </Head>
        <Header />
        <main>
            <Playlist />                            
        </main>
    </div>
  )
  
  export default Index