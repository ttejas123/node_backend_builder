const generateFormScss = () => {
    return (
      `
      @import url('https://rsms.me/inter/inter.css');

:root {
  --color-light: white;
  --color-dark: #212121;
  --color-signal: #fab700;
  
  --color-background: var(--color-light);
  --color-text: var(--color-dark);
  --color-accent: var(--color-signal);
  
  --size-bezel: .5rem;
  --size-radius: 4px;
  
  line-height: 1.4;
  
  font-family: 'Inter', sans-serif;
  font-size: calc(.6rem + .4vw);
  color: var(--color-text);
  background: var(--color-background);
  font-weight: 300;
  padding: 0 calc(var(--size-bezel) * 3);
}

h1, h2, h3 {
  font-weight: 900;
}

mark {
  background: var(--color-accent);
  color: var(--color-text);
  font-weight: bold;
  padding: 0 0.2em;
}

.card {
  background: var(--color-background);
  padding: calc(4 * var(--size-bezel));
  margin-top: calc(4 * var(--size-bezel));
  border-radius: var(--size-radius);
  border: 3px solid var(--color-shadow, currentColor);
  box-shadow: .5rem .5rem 0 var(--color-shadow, currentColor);
  
  &--inverted {
    --color-background: var(--color-dark);
    color: var(--color-light);
    --color-shadow: var(--color-accent);
  }
  
  &--accent {
    --color-background: var(--color-signal);
    --color-accent: var(--color-light);
    color: var(--color-dark);
  }
  
  *:first-child {
    margin-top: 0;
  }
}


.l-design-widht {
  max-width: 40rem;
  padding: 1rem;
}

.input {
  position: relative;
  
  &__label {
    position: absolute;
    left: 0;
    top: 0;
    padding: calc(var(--size-bezel) * 0.75) calc(var(--size-bezel) * .5);
    margin: calc(var(--size-bezel) * 0.75 + 3px) calc(var(--size-bezel) * .5);
    background: pink;
    white-space: nowrap;
    transform: translate(0, 0);
    transform-origin: 0 0;
    background: var(--color-background);
    transition: transform 120ms ease-in;
    font-weight: bold;
    line-height: 1.2;
  }
  &__field {
    box-sizing: border-box;
    display: block;
    width: 100%;
    border: 3px solid currentColor;
    padding: calc(var(--size-bezel) * 1.5) var(--size-bezel);
    color: currentColor;
    background: transparent;
    border-radius: var(--size-radius);
    
    &:focus,
    &:not(:placeholder-shown) {
      & + .input__label {
        transform: translate(.25rem, -65%) scale(.8);
        color: var(--color-accent);
      }
    }
  }
}


.button-group {
  margin-top: calc(var(--size-bezel) * 2.5);
}

button {
  color: currentColor;
  padding: var(--size-bezel) calc(var(--size-bezel) * 2);
  background: var(--color-accent);
  border: none;
  border-radius: var(--size-radius);
  font-weight: 900;
  
  &[type=reset]{
    background: var(--color-background);
    font-weight: 200;
  } 
}

button + button {
  margin-left: calc(var(--size-bezel) * 2);
}

.icon {
  display: inline-block;
  width: 1em; height: 1em;
  margin-right: .5em;
}

.hidden {
  display: none;
}
      `
    )
  }

module.exports = generateFormScss;