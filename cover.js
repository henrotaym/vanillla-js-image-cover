
// CSS
// image doit être en relative
// les points en absolute

class Cover
{
    constructor({ container, template = "", coordinates = false }) 
    {
        // Storing options
        this.template = template;
        this.coordinates = coordinates;
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
        // Adding elmement
        this.appendPointTemplate(point)
            .setPointStyle(point)

        // Adding point to handled points
        this.points.push(point);
    }

    appendPointTemplate(point)
    {
        const element = document.createElement('div');
        element.innerHTML = this.getPointTemplate(point);
        if (point.listeners) {
            point.listeners.forEach(({ type, callback }) => element.addEventListener(type, callback))
        }
        point.element = this.container.appendChild(element);

        return this;
    }

    getPointTemplate(point)
    {
        const { template } = point;
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

        if (this.coordinates) this.image.addEventListener('click', this.getRelativeCoordinates.bind(this));
    }

    getRelativeCoordinates({ x, y })
    {
        const { clientWidth: container_width, clientHeight: container_height } = this.container
        const { top, left } = this.image.getBoundingClientRect();
        const width = x - left;
        const height = y - top;
        console.log({ 
            left: Math.round(width * 100 / container_width) / 100,
            top: Math.round(height * 100 / container_height) / 100,
        })
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
        left: 0.30,
        top: 0.30,
        template: { text: "Panneaux photovoltaïques", link: "panneaux" }, 
    },
    {
        left: 0.50,
        top: 0.70,
        template: { text: "Eclairage", link: "eclairage" }, 
    },
    {
        left: 0.63,
        top: 0.23,
        template: { text: "Parachèvement", link: "parachevement" },
    },
];

// Creating cover class with image container id
const cover = new Cover({
    template,
    container: "image-container",
    coordinates: true
});
// When cover is ready add points.
cover.ready = () => {
    cover.addPoints(points);
};

