
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

