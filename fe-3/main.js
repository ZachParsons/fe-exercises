function setOutput(FR) {
  FR.onload = function () {
    
    let strings = FR.result.split('\n')
    let truncated = strings.map(string => truncate(string, 14));
    console.log(
      truncated
    )

    document.getElementById('output').textContent = truncated.join('\n');
  }
}

function truncate(message, K) {  
  let inputWords = message.split(' ');
  let outputWords = [];
  let quota = K;
  let terminator = false;

  outputWords =     
    inputWords.filter(word => {
      let wl = word.length;

      if (word.length <= quota && !terminator) {
        quota = quota - (wl + 1);
        return true;
      } else {
        terminator = true;
        return false;
      }
    })
  return outputWords.join(" ");
}

function getInput(context) {
  // 1. get input text.
  var FR = new FileReader();
  console.log("FR", FR);
  
  // 2. reads the Blob as text.
  FR.readAsText(context.files[0])
  return FR;
}

function solve() {
  document.addEventListener('DOMContentLoaded', (event) => {
      
    document.getElementById('input-file').addEventListener('change', function(){
      let FR = getInput(this);

      // 3. outputs text to DOM.
      setOutput(FR);
    })
  
  })
} 

solve()