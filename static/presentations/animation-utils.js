/**
 * Animation Utilities for Distributed Training Presentation
 * Unified animation framework for consistent behavior across all slides
 * Version 2.0
 */

// ============================================================
// ANIMATION CONTROLLER CLASS
// ============================================================

class AnimationController {
    constructor(totalSteps) {
        this.totalSteps = totalSteps;
        this.currentStep = 0;
        this.callbacks = {
            onStepChange: [],
            onComplete: [],
            onReset: []
        };
        this.isAnimating = false;

        // Initialize controls
        this.initializeControls();
        this.setupKeyboardNavigation();
        this.setupMessageListener();
    }

    /**
     * Initialize animation controls UI
     */
    initializeControls() {
        // Check if controls already exist
        if (document.querySelector('.animation-controls')) {
            const existingControls = document.querySelector('.animation-controls');
            this.updateControlsUI(existingControls);
            return;
        }

        // Create controls container
        const controls = document.createElement('div');
        controls.className = 'animation-controls';
        controls.setAttribute('role', 'navigation');
        controls.setAttribute('aria-label', 'Animation controls');

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'anim-arrow';
        prevBtn.id = 'prevAnim';
        prevBtn.textContent = '←';
        prevBtn.setAttribute('aria-label', 'Previous step');
        prevBtn.disabled = true;
        prevBtn.onclick = () => this.navigateAnimation(-1);

        // Step indicator
        const indicator = document.createElement('div');
        indicator.className = 'animation-step-indicator';
        indicator.setAttribute('aria-live', 'polite');
        indicator.innerHTML = `<span id="currentStep">1</span> / <span id="totalSteps">${this.totalSteps}</span>`;

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'anim-arrow';
        nextBtn.id = 'nextAnim';
        nextBtn.textContent = '→';
        nextBtn.setAttribute('aria-label', 'Next step');
        nextBtn.disabled = this.totalSteps <= 1;
        nextBtn.onclick = () => this.navigateAnimation(1);

        // Assemble controls
        controls.appendChild(prevBtn);
        controls.appendChild(indicator);
        controls.appendChild(nextBtn);

        // Add to document
        document.body.appendChild(controls);

        // Fade in animation
        setTimeout(() => {
            controls.style.opacity = '0';
            controls.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                controls.style.opacity = '1';
            }, 50);
        }, 100);
    }

    /**
     * Update existing controls UI
     */
    updateControlsUI(controlsElement) {
        const currentStepSpan = controlsElement.querySelector('#currentStep') ||
                               controlsElement.querySelector('.current-step');
        const totalStepsSpan = controlsElement.querySelector('#totalSteps') ||
                              controlsElement.querySelector('.total-steps');
        const prevBtn = controlsElement.querySelector('#prevAnim');
        const nextBtn = controlsElement.querySelector('#nextAnim');

        if (currentStepSpan) currentStepSpan.textContent = this.currentStep + 1;
        if (totalStepsSpan) totalStepsSpan.textContent = this.totalSteps;
        if (prevBtn) prevBtn.disabled = this.currentStep === 0;
        if (nextBtn) nextBtn.disabled = this.currentStep >= this.totalSteps - 1;
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Don't interfere with input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Arrow keys for animation navigation (when Shift is held)
            if (e.shiftKey) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.navigateAnimation(1);
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.navigateAnimation(-1);
                }
            }

            // Space bar to advance
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                this.navigateAnimation(1);
            }
        });
    }

    /**
     * Setup message listener for parent-child communication
     */
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'navigateAnimation') {
                this.navigateAnimation(event.data.direction);
            } else if (event.data && event.data.type === 'requestAnimationState') {
                this.sendStateToParent();
            }
        });
    }

    /**
     * Send current animation state to parent window
     */
    sendStateToParent() {
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'animationState',
                currentStep: this.currentStep + 1,
                totalSteps: this.totalSteps,
                canGoPrev: this.currentStep > 0,
                canGoNext: this.currentStep < this.totalSteps - 1
            }, '*');
        }
    }

    /**
     * Navigate to next/previous animation step
     */
    navigateAnimation(direction) {
        if (this.isAnimating) return;

        const newStep = this.currentStep + direction;

        // Validate step range
        if (newStep < 0 || newStep >= this.totalSteps) {
            return;
        }

        this.isAnimating = true;
        this.currentStep = newStep;

        // Update UI controls
        this.updateControls();

        // Execute step callbacks
        this.executeCallbacks('onStepChange', this.currentStep);

        // Send state update to parent
        this.sendStateToParent();

        // Check if animation is complete
        if (this.currentStep === this.totalSteps - 1) {
            this.executeCallbacks('onComplete', this.currentStep);
        }

        // Release animation lock after a short delay
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }

    /**
     * Update control buttons state
     */
    updateControls() {
        const prevBtn = document.getElementById('prevAnim');
        const nextBtn = document.getElementById('nextAnim');
        const currentStepSpan = document.getElementById('currentStep');

        if (prevBtn) {
            prevBtn.disabled = this.currentStep === 0;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentStep >= this.totalSteps - 1;
        }

        if (currentStepSpan) {
            currentStepSpan.textContent = this.currentStep + 1;
        }
    }

    /**
     * Register a callback for animation events
     */
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    /**
     * Execute callbacks for an event
     */
    executeCallbacks(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} callback:`, error);
                }
            });
        }
    }

    /**
     * Go to a specific step
     */
    goToStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.totalSteps && stepIndex !== this.currentStep) {
            const direction = stepIndex > this.currentStep ? 1 : -1;
            const steps = Math.abs(stepIndex - this.currentStep);

            // Animate through steps
            let count = 0;
            const interval = setInterval(() => {
                this.navigateAnimation(direction);
                count++;
                if (count >= steps) {
                    clearInterval(interval);
                }
            }, 400);
        }
    }

    /**
     * Reset animation to first step
     */
    reset() {
        this.currentStep = 0;
        this.updateControls();
        this.executeCallbacks('onReset');
        this.sendStateToParent();
    }

    /**
     * Get current step index
     */
    getCurrentStep() {
        return this.currentStep;
    }

    /**
     * Get total number of steps
     */
    getTotalSteps() {
        return this.totalSteps;
    }
}

// ============================================================
// ANIMATION HELPER FUNCTIONS
// ============================================================

/**
 * Fade in element with optional delay
 */
function fadeIn(element, delay = 0, duration = 800) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

            // Trigger reflow
            element.offsetHeight;

            element.style.opacity = '1';

            setTimeout(resolve, duration);
        }, delay);
    });
}

/**
 * Fade out element
 */
function fadeOut(element, duration = 600) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        element.style.transition = `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.opacity = '0';

        setTimeout(resolve, duration);
    });
}

/**
 * Slide in element from direction
 */
function slideIn(element, direction = 'up', delay = 0, duration = 800) {
    if (!element) return Promise.resolve();

    const transforms = {
        up: 'translateY(40px)',
        down: 'translateY(-40px)',
        left: 'translateX(40px)',
        right: 'translateX(-40px)'
    };

    return new Promise((resolve) => {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = transforms[direction] || transforms.up;
            element.style.transition = `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

            // Trigger reflow
            element.offsetHeight;

            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';

            setTimeout(resolve, duration);
        }, delay);
    });
}

/**
 * Scale in element
 */
function scaleIn(element, delay = 0, duration = 600) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            element.style.transition = `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

            // Trigger reflow
            element.offsetHeight;

            element.style.opacity = '1';
            element.style.transform = 'scale(1)';

            setTimeout(resolve, duration);
        }, delay);
    });
}

/**
 * Add class with animation
 */
function addClassAnimated(element, className, delay = 0) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        setTimeout(() => {
            element.classList.add(className);
            // Wait for animation to complete (estimate)
            setTimeout(resolve, 800);
        }, delay);
    });
}

/**
 * Remove class with animation
 */
function removeClassAnimated(element, className, duration = 600) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        element.classList.remove(className);
        setTimeout(resolve, duration);
    });
}

/**
 * Stagger animations for multiple elements
 */
function staggerAnimation(elements, animationFn, staggerDelay = 100) {
    if (!elements || elements.length === 0) return Promise.resolve();

    const promises = Array.from(elements).map((element, index) => {
        return animationFn(element, index * staggerDelay);
    });

    return Promise.all(promises);
}

/**
 * Animate element along a path
 */
function animateAlongPath(element, startPos, endPos, duration = 1000, easing = 'cubic-bezier(0.4, 0, 0.2, 1)') {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        element.style.position = 'absolute';
        element.style.left = startPos.x + 'px';
        element.style.top = startPos.y + 'px';
        element.style.transition = `all ${duration}ms ${easing}`;

        // Trigger reflow
        element.offsetHeight;

        element.style.left = endPos.x + 'px';
        element.style.top = endPos.y + 'px';

        setTimeout(resolve, duration);
    });
}

/**
 * Pulse animation
 */
function pulse(element, count = 1, duration = 1000) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        let pulseCount = 0;

        function doPulse() {
            element.style.transition = `transform ${duration / 2}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            element.style.transform = 'scale(1.1)';

            setTimeout(() => {
                element.style.transform = 'scale(1)';
                pulseCount++;

                if (pulseCount < count) {
                    setTimeout(doPulse, duration / 2);
                } else {
                    setTimeout(resolve, duration / 2);
                }
            }, duration / 2);
        }

        doPulse();
    });
}

/**
 * Highlight element with glow effect
 */
function highlightGlow(element, duration = 2000) {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        const originalBoxShadow = element.style.boxShadow;

        element.style.transition = `box-shadow ${duration / 4}ms ease-in-out`;
        element.style.boxShadow = '0 0 40px rgba(74, 158, 255, 0.8)';

        setTimeout(() => {
            element.style.boxShadow = originalBoxShadow;
            setTimeout(resolve, duration / 4);
        }, duration * 3 / 4);
    });
}

/**
 * Sequential animation runner
 */
async function runSequence(...animations) {
    for (const animation of animations) {
        await animation();
    }
}

/**
 * Parallel animation runner
 */
function runParallel(...animations) {
    return Promise.all(animations.map(anim => anim()));
}

/**
 * Wait for specified duration
 */
function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

// ============================================================
// CANVAS ANIMATION HELPERS
// ============================================================

/**
 * Canvas animation loop manager
 */
class CanvasAnimationLoop {
    constructor(canvas, drawFunction) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.drawFunction = drawFunction;
        this.animationId = null;
        this.isRunning = false;
        this.frameCount = 0;
        this.startTime = null;
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startTime = performance.now();

        const animate = (currentTime) => {
            if (!this.isRunning) return;

            const deltaTime = currentTime - (this.lastTime || currentTime);
            this.lastTime = currentTime;
            const elapsedTime = currentTime - this.startTime;

            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Call draw function
            this.drawFunction(this.ctx, elapsedTime, deltaTime, this.frameCount);

            this.frameCount++;
            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    reset() {
        this.frameCount = 0;
        this.startTime = performance.now();
        this.lastTime = null;
    }
}

/**
 * Ease-in-out function
 */
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Ease-out function
 */
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease-in function
 */
function easeInCubic(t) {
    return t * t * t;
}

/**
 * Linear interpolation
 */
function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Map value from one range to another
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// ============================================================
// EXPORT FOR USE IN OTHER SCRIPTS
// ============================================================

// Make functions globally available
window.AnimationController = AnimationController;
window.CanvasAnimationLoop = CanvasAnimationLoop;

// Export animation helpers
window.AnimationUtils = {
    fadeIn,
    fadeOut,
    slideIn,
    scaleIn,
    addClassAnimated,
    removeClassAnimated,
    staggerAnimation,
    animateAlongPath,
    pulse,
    highlightGlow,
    runSequence,
    runParallel,
    wait,
    easeInOutCubic,
    easeOutCubic,
    easeInCubic,
    lerp,
    mapRange
};

// Compatibility: Expose navigateAnimation globally for parent-child communication
window.navigateAnimation = function(direction) {
    if (window.animationController) {
        window.animationController.navigateAnimation(direction);
    }
};

window.updateControls = function() {
    if (window.animationController) {
        window.animationController.updateControls();
        window.animationController.sendStateToParent();
    }
};

// Export animation state variables for parent access
window.currentAnimationStep = 0;
window.totalAnimationSteps = 1;

console.log('Animation utilities loaded successfully');
