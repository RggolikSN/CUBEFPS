class CUBEFPS {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.fpsCounter = document.getElementById('fpsCounter');
        this.performanceText = document.getElementById('performanceText');
        this.loadingProgress = document.getElementById('loadingProgress');
        this.cube = document.getElementById('cube');
        this.faces = document.querySelectorAll('.face');
        this.particlesContainer = document.getElementById('particles');

        this.performance = {
            fps: 0,
            frameCount: 0,
            lastTime: performance.now(),
            score: 0,
            calculationTime: 0,
            memoryUsage: 0
        };

        this.animationState = {
            rotationX: 15,
            rotationY: 15,
            rotationZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            animationPhase: 0,
            phaseStartTime: 0
        };

        this.particleCount = 500;
        this.workers = [];
        this.heavyInterval = null;
        this.animationId = null;

        this.init();
    }

    init() {
        this.createParticles();
        this.startPerformanceMonitoring();
        this.startHeavyCalculations();
        this.startCubeAnimations();
        this.startWebWorkers();

        this.animationState.phaseStartTime = performance.now();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            setTimeout(() => this.createParticle(), i * 10);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 1;
        const posX = Math.random() * window.innerWidth;
        const duration = Math.random() * 8 + 4;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${posX}px;
            top: ${window.innerHeight + 20}px;
            animation-duration: ${duration}s;
            background: rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2});
            box-shadow: 0 0 ${size * 3}px ${size}px rgba(255, 255, 255, 0.5);
        `;

        particle.addEventListener('animationend', () => {
            particle.remove();
            this.createParticle();
        });

        this.particlesContainer.appendChild(particle);
    }

    startPerformanceMonitoring() {
        const updatePerformance = () => {
            const currentTime = performance.now();
            const deltaTime = currentTime - this.performance.lastTime;

            if (deltaTime >= 1000) {
                this.performance.fps = Math.round((this.performance.frameCount * 1000) / deltaTime);
                this.performance.frameCount = 0;
                this.performance.lastTime = currentTime;

                this.updateDisplay();
            }

            this.performance.frameCount++;
            requestAnimationFrame(updatePerformance);
        };

        updatePerformance();
    }

    updateDisplay() {
        this.fpsCounter.textContent = `FPS: ${this.performance.fps}`;

        const targetScore = Math.min(1000, this.performance.fps * 8 +
            Math.max(0, 200 - this.performance.calculationTime) * 2);

        this.performance.score += (targetScore - this.performance.score) * 0.1;
        this.scoreElement.textContent = Math.round(this.performance.score);

        this.updatePerformanceText();
    }

    updatePerformanceText() {
        const score = this.performance.score;
        let text = '';

        if (score >= 950) text = 'EXTREME PERFORMANCE';
        else if (score >= 850) text = 'MAXIMUM POWER';
        else if (score >= 700) text = 'HIGH PERFORMANCE';
        else if (score >= 550) text = 'GOOD PERFORMANCE';
        else if (score >= 400) text = 'AVERAGE PERFORMANCE';
        else if (score >= 250) text = 'LOW PERFORMANCE';
        else text = 'MINIMAL PERFORMANCE';

        this.performanceText.textContent = text;
    }

    startHeavyCalculations() {
        this.heavyInterval = setInterval(() => {
            const startTime = performance.now();

            this.performExtremeCalculations();
            this.performMemoryStressTest();
            this.performPhysicsCalculations();

            this.performance.calculationTime = performance.now() - startTime;
        }, 16);
    }

    performExtremeCalculations() {
        let total = 0;
        const iterations = 2000000;

        for (let i = 0; i < iterations; i++) {
            const x = i * Math.PI;
            total += Math.sin(x) * Math.cos(x) * Math.tan(x % 180);
            total += Math.sqrt(i) * Math.log(i + 1);
            total += Math.pow(Math.sin(i), Math.cos(i));

            for (let j = 0; j < 10; j++) {
                total += Math.atan2(i, j + 1) * Math.exp((i % 1000) / 1000);
            }
        }
    }

    performMemoryStressTest() {
        const memoryArrays = [];

        for (let i = 0; i < 50; i++) {
            const largeArray = new Float64Array(50000);
            const objectArray = new Array(10000);

            for (let j = 0; j < largeArray.length; j++) {
                largeArray[j] = Math.random() * Math.PI * Math.E;
                if (j < objectArray.length) {
                    objectArray[j] = {
                        x: Math.sin(j) * Math.cos(j),
                        y: Math.tan(j % 180),
                        z: Math.sqrt(j),
                        data: new Array(20).fill(null).map(() => Math.random())
                    };
                }
            }

            memoryArrays.push(largeArray, objectArray);
        }

        setTimeout(() => {
            memoryArrays.length = 0;
        }, 1000);
    }

    performPhysicsCalculations() {
        const particles = 2000;
        let energy = 0;

        for (let i = 0; i < particles; i++) {
            const velocity = Math.random() * 20;
            const mass = Math.random() * 10;
            const acceleration = Math.random() * 5;

            energy += 0.5 * mass * velocity * velocity;
            energy += mass * acceleration * velocity;

            for (let j = 0; j < 5; j++) {
                energy += Math.sin(velocity) * Math.cos(acceleration) * mass;
                energy += Math.tan(velocity % 180) * Math.log(mass + 1);
            }
        }
    }

    startCubeAnimations() {
        const animateCube = () => {
            const currentTime = performance.now();
            const phaseTime = (currentTime - this.animationState.phaseStartTime) / 1000;

            this.updateAnimationPhase(phaseTime);
            this.applyCubeTransformations();
            this.updateFaceEffects();

            this.animationId = requestAnimationFrame(animateCube);
        };

        animateCube();
    }

    updateAnimationPhase(phaseTime) {
        if (phaseTime > 15) {
            this.animationState.animationPhase = (this.animationState.animationPhase + 1) % 3;
            this.animationState.phaseStartTime = performance.now();
            return;
        }

        const progress = phaseTime / 5;
        const phase = Math.floor(phaseTime / 5);

        switch (phase) {
            case 0:
                this.animationState.scaleX = 0.5 + progress * 1.5;
                break;
            case 1:
                this.animationState.scaleY = 0.5 + (progress - 1) * 1.5;
                break;
            case 2:
                this.animationState.scaleZ = 0.5 + (progress - 2) * 1.5;
                break;
        }

        this.animationState.rotationY += 1.5;
        this.animationState.rotationX += 0.8;
        this.animationState.rotationZ += 0.3;
    }

    applyCubeTransformations() {
        this.cube.style.transform = `
            rotateX(${this.animationState.rotationX}deg)
            rotateY(${this.animationState.rotationY}deg)
            rotateZ(${this.animationState.rotationZ}deg)
            scale3d(
                ${this.animationState.scaleX},
                ${this.animationState.scaleY},
                ${this.animationState.scaleZ}
            )
        `;
    }

    updateFaceEffects() {
        const time = performance.now() * 0.001;

        this.faces.forEach((face, index) => {
            const pulse = Math.sin(time * 3 + index) * 0.2 + 0.8;
            const distortion = Math.sin(time * 5 + index) * 2;

            face.style.opacity = pulse.toString();
            face.style.filter = `
                blur(${Math.abs(Math.sin(time * 2 + index))}px)
                contrast(${1 + pulse * 0.3})
            `;

            face.style.transform = face.style.transform.split(' ')[0] +
                ` translateZ(${distortion}px)`;
        });
    }

    startWebWorkers() {
        for (let i = 0; i < 4; i++) {
            this.createWorker(i);
        }
    }

    createWorker(id) {
        const workerCode = `
            let computationCount = 0;
            self.onmessage = function(e) {
                const startTime = performance.now();
                let result = 0;

                for (let i = 0; i < 500000; i++) {
                    result += Math.sin(i) * Math.cos(i) * Math.sqrt(i);
                    result += Math.log(i + 1) * Math.exp((i % 1000) / 1000);
                    result += Math.atan2(i, i % 100 + 1) * Math.pow(Math.E, (i % 500) / 500);

                    for (let j = 0; j < 3; j++) {
                        result += Math.tan(i % 180) * Math.cos(j) * Math.sin(i + j);
                    }
                }

                computationCount++;
                const endTime = performance.now();

                postMessage({
                    id: ${id},
                    computationTime: endTime - startTime,
                    result: result,
                    count: computationCount
                });
            };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        worker.onmessage = (e) => {
            this.performance.calculationTime = Math.min(
                this.performance.calculationTime,
                e.data.computationTime
            );
        };

        setInterval(() => {
            worker.postMessage('compute');
        }, 50);

        this.workers.push(worker);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.heavyInterval) {
            clearInterval(this.heavyInterval);
        }

        this.workers.forEach(worker => worker.terminate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CUBEFPS();
});

window.addEventListener('beforeunload', () => {
    console.log('CUBEFPS: Extreme performance test completed');
});