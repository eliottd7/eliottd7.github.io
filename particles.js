const canvas = document.getElementById("simulation");
field = document.getElementById("simulation").getContext('2d')

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    canvas.width = 0.95*window.innerWidth;
    canvas.height = 0.95*window.innerHeight;
}
resizeCanvas();

// Particle Simulation Global Parameters
particle_size = 1.5
velocity_cap = 1.5
particles = []

randomX = () => {
    return Math.random() * canvas.width
}
randomY = () => {
    return Math.random() * canvas.height
}

draw = (x, y, color, s) => {
    field.fillStyle = color
    field.fillRect(x, y, s, s)
}

particle = (x, y, color, border_type) => {
    return {
        "x":x,
        "y":y,
        "vx":0,
        "vy":0,
        "color":color,
        "border":border_type
    }
}

create = (number, color, border) => {
    group = []
    for (let i = 0; i < number; i++){
        group.push(particle(randomX(), randomY(), color, border))
        particles.push(group[i])
    }
    return group
}

create_at = (x, y, number, color, border) => {
    group = []
    for (let i = 0; i < number; i++){
        group.push(particle(x, y, color, border))
        particles.push(group[i])
    }
    return group
}

rule = (part1, part2, g) => {
    for(let i = 0; i < part1.length; i++){
        fx = 0
        fy = 0

        for(let j = 0; j < part2.length; j++){
            a = part1[i]
            b = part2[j]

            dx = a.x - b.x
            dy = a.y - b.y
            d = Math.sqrt(dx * dx + dy * dy)

            if (d > 0) {
                F = g * 1 / d
                fx += (F * dx)
                fy += (F * dy)
            }

            a.vx = (a.vx + fx)
            a.vy = (a.vy + fy)

            if(a.vx > velocity_cap) a.vx = velocity_cap
            else if(a.vx < 0-velocity_cap) a.vx = 0-velocity_cap

            if(a.vy > velocity_cap) a.vy = velocity_cap
            else if(a.vy < 0-velocity_cap) a.vy = 0-velocity_cap

            a.x += a.vx
            a.y += a.vy

            if(a.border){
                if (a.x > canvas.width){
                    a.x = canvas.width - 1
                    a.vx = -a.vx + Math.random()
                } 
                else if (a.x < 0) {
                    a.x = 0
                    a.vx = -a.vx + Math.random()
                }
                if (a.y > canvas.height){
                    a.y = canvas.height - 1
                    a.vy = -a.vy + Math.random()
                }
                else if (a.y < 0) {
                    a.y = 0
                    a.vy = -a.vy + Math.random()
                }

            } else {
                if (a.x > canvas.width) a.x = 0
                else if (a.x < 0) a.x = canvas.width
                if (a.y > canvas.height) a.y = 0
                else if (a.y < 0) a.y = canvas.height
            }
        }
    }
}

direction = true
pgreen = 255
pblue = 0
setInterval(function(){
    if(direction){
        pgreen -= 1
        pblue += 1
    } else {
        pgreen += 1
        pblue -= 1
    }

    if(pgreen < 0){
        pgreen = 0
        direction = false
    }
    else if(pblue < 0){
        pblue = 0
        direction = true
    }
}, 100)

update = () => {
    
    colorstring = "rgb(0, " + pgreen.toString() + ", " + pblue.toString() + ")"

    rule(green, yellow, -0.005)
    rule(yellow, mouse, -0.5)
    rule(yellow, gravity, -0.5)
    rule(yellow, yellow, 0.08)
    field.clearRect(0, 0, canvas.width + particle_size, canvas.height + particle_size)
    for(i = 5; i < particles.length; i++){
        draw(particles[i].x, particles[i].y, colorstring, particle_size)
    }
    requestAnimationFrame(update)
}

yellow = create(3, "black", true)
mouse = []
gravity = create_at(canvas.width / 2, canvas.height / 2, 1, "black", false)
green = create(20000, "#00dead", true)


follow_mouse = false
function handlemouseclick(event){
    if(follow_mouse){
        particles.pop()
        follow_mouse = false
        gravity = mouse
        gravity[0].x = canvas.width / 2
        gravity[0].y = canvas.height / 2
        mouse = []
    } else {
        follow_mouse = true
        mouse = gravity
        mouse[0].x = event.pageX
        mouse[0].y = event.pageY
        gravity = []
    }
}
function handlemousemove(event){
    if(follow_mouse){
        mouse[0].x = event.pageX
        mouse[0].y = event.pageY
    }
}
document.onmousedown = handlemouseclick
document.onmouseup = handlemouseclick
document.onmousemove = handlemousemove

update();