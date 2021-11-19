const template = `
<a href="$link" class="group relative">
    <button class="relative rounded-full bg-white group-hover:bg-green-600 transition duration-200 p-1">
        <div class="bg-black group-hover:bg-white transition duration-200 p-1 rounded-full">
        </div>
    </button>
    <div class="absolute opacity-0 group-hover:opacity-100 transition duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
        <span class="block text-xs md:text-base bg-green-600 text-white whitespace-nowrap rounded p-2">
            $text
        </span>
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 h-2.5 w-2.5 transform rotate-45">
        </div> 
    </div>
</a>
`;

const points = [
    {
        "left": 0.22,
        "top": 0.37,
        "listeners": [],
        "template": {
            "text": "testastos"
        }
    },
    {
        "left": 0.58,
        "top": 0.37,
        "listeners": [],
        "template": {}
    },
    {
        "left": 0.69,
        "top": 0.27,
        "listeners": [],
        "template": {}
    },
    {
        "left": 0.73,
        "top": 0.72,
        "listeners": [],
        "template": {}
    },
    {
        "left": 0.37,
        "top": 0.22,
        "listeners": [],
        "template": {}
    },
    {
        "left": 0.81,
        "top": 0.55,
        "listeners": [],
        "template": {}
    },
    {
        "left": 0.93,
        "top": 0.56,
        "listeners": [],
        "template": {}
    }
];

// Creating cover class with image container id
const cover = new Cover({
    template,
    container: "image-container",
    debug: true
});
// When cover is ready add points.
cover.ready = () => {
    cover.addPoints(points);
};