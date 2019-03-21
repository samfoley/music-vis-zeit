import Songs from '../src/songs'
import Song from '../components/song'

export default (props) => {
    const songs = new Songs();
    return (    
    <div className="playlist">
        <ul>
            {songs.getSongs().map((name) => 
                (<li key={name}><Song name={name} /></li>)
            )}
        </ul>
    </div>
)}