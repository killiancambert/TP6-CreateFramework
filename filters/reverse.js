module.exports = (texte) => {
    const words = texte.split(" ");
    let inversedPhrase = [];
    for (let i = words.length - 1; i >= 0; i--) {
      inversedPhrase.push(words[i]);
    }
    return inversedPhrase.join(" ");
  };