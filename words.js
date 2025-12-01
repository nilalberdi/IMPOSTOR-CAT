const WORDS = {
    "Objectes quotidians": [
        "Forquilla", "Cadira", "Rellotge", "Motxilla", "Paperera", "Mirall", "Escuma d'afaitar", 
        "Capsa", "Paraigua", "Raspall de dents", "Cargol", "Llibreta", "Cargolador", "Estora", 
        "Polvoritzador", "Termo", "Cartró", "Clauer", "Barret", "Ampolla", "Tovallola", 
        "Altaveu portàtil", "Llum de sobretaula", "Bolígraf", "Safata", "Llanterna", 
        "Alfombra", "Tenedor", "Pinzell", "Ulleres de sol", "Carregador"
    ],
    "Menjar i begudes": [
        "Mandarina", "Sushis", "Patates fregides", "Crema catalana", "Hamburguesa", "Espaguetis", 
        "Pastanaga", "Pizza", "Xurros", "Coca-cola", "Pa amb tomata", "Cereal", "Brownie", 
        "Broquetes", "Calamars a la romana", "Llimonada", "Croissant", "Ensaladilla russa", 
        "Nuggets", "Cafè", "Fanta", "Bunyols", "Iogurt", "Pollastre al forn", "Orxata",
        "Té fred", "Smoothie", "Entrepà", "Crema", "Xocolata calenta", "Pancakes", "Fruits secs"
    ],
    "Llocs": [
        "Aeroport", "Biblioteca", "Platja", "Bosc", "Museu", "Hospital", "Estadi", "Metro", 
        "Universitat", "Teatre", "Parc d'atraccions", "Carrer Major", "Estació de tren", 
        "Pàrquing", "Palau", "Cinema", "Supermercat", "Jardí", "Torre", "Mercat", "Gimnàs", 
        "Terrassa d'un bar", "Pont", "Piscina", "Serralleria", "Centre comercial", "Cafeteria",
        "Jardí botànic", "Platja nudista", "Aquari", "Illa"
    ],
    "Professions": [
        "Metge", "Fuster", "Periodista", "Professor", "Cuiner", "Bomber", "Policia", "Arquitecte", 
        "Enginyer", "Pagès", "Actor", "Director de cinema", "DJ", "Advocat", "Infermera", 
        "Mecànic", "Cambrer", "Electricista", "Fotògraf", "Dissenyador gràfic", "Programador", 
        "Pilot d'avió", "Bussejador", "Psicòleg", "Veterinari", "Estilista", "Entrenador personal",
        "Agricultor", "Dentista", "Enginyer civil"
    ],
    "Animals": [
        "Lleó", "Pingüí", "Cavall", "Tortuga", "Dofí", "Àliga", "Llop", "Serp", "Ruc", 
        "Gallina", "Ratolí", "Ós panda", "Cérvol", "Gat", "Gos", "Guepard", "Koala", "Tauró", 
        "Camell", "Estrella de mar", "Pop", "Formiga", "Mosquit", "Pardal", "Medusa",
        "Rinoceront", "Guineu", "Ratpenat", "Lèmur", "Cangur", "Ós polar", "Esquirol", "Mussol"
    ],
    "Famosos": [
        "Messi", "Rosalía", "Tom Holland", "Zendaya", "The Rock", "Taylor Swift", "Chris Hemsworth", 
        "Dua Lipa", "Neymar", "Ariana Grande", "Morgan Freeman", "Billie Eilish", "Bad Bunny", 
        "Ryan Gosling", "Margot Robbie", "Keanu Reeves", "Cillian Murphy", "Jennifer Lawrence", 
        "Shakira", "Robert Pattinson", "Emma Watson", "Pedro Pascal", "Timothée Chalamet", 
        "Michael Jordan", "Lady Gaga", "Maluma", "Drake", "Adele", "Elon Musk", "Jennifer Lopez",
        "Pedro Sánchez", "Ábalos", "Hitler", "Franco", "Donald Trump", "Putin", "Ibai"
    ],
    "Pel·lícules": [
        "La La Land", "Interstellar", "Oppenheimer", "El Gran Hotel Budapest", "Inception", 
        "Gladiator", "Avatar", "El Senyor dels Anells", "Shrek", "Ocean's Eleven", "Pulp Fiction", 
        "Whiplash", "Cars", "Forrest Gump", "El Padrí", "Toy Story", "Joker", 
        "Spider-Man: No Way Home", "Inside Out", "El Club de la Lluita", "Dune", "Mad Max: Fury Road", 
        "John Wick", "Coco", "Harry Potter i la Pedra Filosofal", "Up", "Minions", "Joker 2",
        "Black Panther", "Avatar 2"
    ],
    "Videojocs": [
        "Minecraft", "Fortnite", "GTA V", "Red Dead Redemption 2", "Among Us", "Call of Duty", 
        "FIFA", "Rocket League", "Pokémon", "Zelda: Breath of the Wild", "Mario Kart", "Overwatch", 
        "League of Legends", "Valorant", "The Witcher 3", "God of War", "Hollow Knight", 
        "Elden Ring", "Clash Royale", "Brawl Stars", "Skyrim", "Cyberpunk 2077", "Uncharted", 
        "Assassin's Creed", "Fall Guys", "Roblox", "Animal Crossing", "Diablo", "Halo",
        "Resident Evil", "Tomb Raider"
    ],
    "Tecnologia": [
        "Smartphone", "Router", "Bluetooth", "USB", "Processador", "Pantalla tàctil", "Impressora", 
        "Cloud", "Dron", "Smartwatch", "Codi QR", "Antivirus", "Base de dades", "Wi-Fi", "Ratolí", 
        "Teclat", "IA generativa", "Càmera DSLR", "Pen drive", "Altaveu intel·ligent", "Microxip", 
        "Sensor", "App", "Servidor", "Cable HDMI", "Smart TV", "Videotrucada", "VR headset",
        "Microones intel·ligent", "Impressora 3D", "GoPro", "Bateria portàtil", "Projector", "Robot aspirador"
    ],
    "Conceptes abstractes": [
        "Felicitat", "Por", "Confiança", "Llibertat", "Esperança", "Paciència", "Orgull", 
        "Creativitat", "Tristesa", "Calma", "Futur", "Ambició", "Energia", "Lògica", "Somni", 
        "Valentia", "Enveja", "Memòria", "Tensió", "Inspiració", "Caos", "Empatia", "Identitat", 
        "Generositat", "Desig", "Art", "Història", "Ciència", "Aventura", "Èxit", "Passió", "Temps"
    ]
};
