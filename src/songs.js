class Songs { 
    constructor() {
        

        this.songs = {
            'melatron': 'Melatron',
            'till-the-sky-falls-down': 'Till the sky falls down',
            'sin-city': 'Sin City'
        };                        
    }

    getSongTitle(name) {
        return this.songs[name];
    }

    getSongs() {            
        return Object.keys(this.songs);
    }
}

export default Songs