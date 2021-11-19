
// CSS
// image doit être en relative
// les points en absolute

class Cover
{
    constructor({ container, template = "", debug = false }) 
    {
        // Storing options
        this.template = template;
        this.debug = debug;
        // Setting up container element
        this.setImageContainer(container);
        // Points will be stored here
        this.points = [];
    }

    ready() {
        // should be replaced
    }

    addPoints(points) {
        points.forEach(point => this.addPoint(point));
    }

    // Adding specified point to handler
    addPoint(point)
    {
        point.listeners = point.listeners || [];
        // Adding elmement
        this.appendPointTemplate(point)
            .setPointStyle(point)

        // Adding point to handled points
        this.points.push(point);
    }

    deletePoint({ left, top })
    {
        const index = this.points.findIndex(p => p.top === top && p.left === left);
        const point = this.points[index];
        point.listeners.forEach(({ type, callback }) => point.element.removeEventListener(type, callback))
        point.element.remove();
        this.points.splice(index, 1);
        this.showPointsDetails();
    }

    appendPointTemplate(point)
    {
        const element = document.createElement('div');
        element.innerHTML = this.getPointTemplate(point);
        point.element = this.container.appendChild(element);
        this.addPointListeners(point)

        return this;
    }

    addPointListeners(point)
    {
        if (this.debug && !point.listeners.find(l => l.debug)) this.addDebugListener(point);
        
        point.listeners.forEach(({ type, callback }) => point.element.addEventListener(type, callback));
    }

    addDebugListener(point)
    {
        point.listeners.push({
            type: "contextmenu",
            callback: (e) => { 
                e.preventDefault();
                this.deletePoint(point); 
            },
            debug: true
        })
    }

    getPointTemplate(point)
    {
        const { template = {} } = point;

        if (typeof template === "string") {
            return template;
        }

        return Object.entries(template).reduce((text, [placeholder, value]) => {
            return text.replace(`$${placeholder}`, value);
        }, this.template)
    }

    getPointStyle(point)
    {
        const { top, left } = point
        
        return {
            position: "absolute",
            top: `${top * 100}%`,
            left: `${left * 100}%`
        }
    }

    setPointStyle(point)
    {
        Object.entries(this.getPointStyle(point)).forEach(([property, value]) => point.element.style[property] = value);
    }


    // Setting related image container
    async setImageContainer(id)
    {
        // Setting container
        this.container = document.getElementById(id)

        // Retrieving image
        this.image = this.container.querySelector('img');
        // Waiting for image to be loaded
        await new Promise(resolve => this.image.onload = resolve);
        // Firing ready callback
        this.ready(this);

        if (this.debug) this.image.addEventListener('click', this.addPointFromClick.bind(this));
    }

    addPointFromClick({ x, y })
    {
        const { clientWidth: container_width, clientHeight: container_height } = this.container
        const { top, left } = this.image.getBoundingClientRect();
        const width = x - left;
        const height = y - top;
        const point = { 
            left: Math.round(width * 100 / container_width) / 100,
            top: Math.round(height * 100 / container_height) / 100,
            listeners: [],
            template: {}
        };
        this.addDebugListener(point)
        this.addPoint(point);
        this.showPointsDetails();
    }

    showPointsDetails()
    {
        console.log(this.points.map(({ element, ...point }) => ({ ...point, listeners: point.listeners?.filter(l => !l.debug) || [] })));
    }
}

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
        "left": 0.4,
        "top": 0.47,
        "listeners": [],
        "template": {}
    },
    {
        "left": 0.11,
        "top": 0.57,
        "listeners": [],
        "template": {}
    },
    {
        "left": 0.3,
        "top": 0.76,
        "listeners": [],
        "template": {}
    },
    {
        "left": 0.58,
        "top": 0.37,
        "listeners": [],
        "template": {}
    },
    {
        "left": 0.55,
        "top": 0.65,
        "listeners": [],
        "template": {}
    },
    {
        "left": 0.78,
        "top": 0.55,
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
        "left": 0.19,
        "top": 0.75,
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
        "left": 0.72,
        "top": 0.51,
        "listeners": [],
        "template": {}
    }
]

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

