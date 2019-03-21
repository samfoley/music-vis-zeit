import Songs from '../src/songs'
import Song from '../components/song'

import Link from 'next/link'


export default (props) => {
    var songs = new Songs();
    return (
    <div className="song">
        <Link 
            as={`/player/${props.name}`} 
            href={`/player?name=${props.name}`}>                
                <a>{songs.getSongTitle(props.name)}</a>
        </Link>
    </div>
)}