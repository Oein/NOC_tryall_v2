const adv = document.getElementById("adv");
const calc = document.getElementById("calc");
const variablesDIV = document.querySelector(".variables");
const result = document.querySelector(".result");
const progress = document.querySelector("progress");
const input = document.querySelector(".for");

let variables = [];
const genid = () => Math.random().toString(36).substring(7);
const report_timing = 10000;
document.getElementById("ld").addEventListener("click", () => {
  const vari = prompt("Enter the variables");
  const js = JSON.parse(vari);
  input.value = js.f;
  variables = js.v;
  variablesDIV.innerHTML = "";
  variables.forEach((v) => {
    // input field each, name, min, max, step(default: 1)
    const id = v.id;
    const name = document.createElement("input");
    name.placeholder = "name";
    name.addEventListener("change", () => {
      const myidx = variables.findIndex((v) => v.id === id);
      variables[myidx].name = name.value;
    });
    name.value = v.name;
    const min = document.createElement("input");
    min.placeholder = "min";
    min.type = "number";
    min.addEventListener("change", () => {
      const myidx = variables.findIndex((v) => v.id === id);
      variables[myidx].min = parseFloat(min.value);
    });
    min.value = v.min;
    const max = document.createElement("input");
    max.placeholder = "max";
    max.type = "number";
    max.addEventListener("change", () => {
      const myidx = variables.findIndex((v) => v.id === id);
      variables[myidx].max = parseFloat(max.value);
    });
    max.value = v.max;
    const step = document.createElement("input");
    step.placeholder = "step";
    step.type = "number";
    step.value = 1;
    step.addEventListener("change", () => {
      const myidx = variables.findIndex((v) => v.id === id);
      variables[myidx].step = parseFloat(step.value);
    });
    step.value = v.step;
    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      variables = variables.filter((v) => v.id !== id);
      variablesDIV.removeChild(variablesDIV.querySelector(`[data-id="${id}"]`));
    });
    const div = document.createElement("div");
    div.dataset.id = id;
    div.append(name, min, max, step, remove);
    variablesDIV.appendChild(div);
  });
});
document.getElementById("export").addEventListener("click", () => {
  alert(
    JSON.stringify({
      v: variables,
      f: input.value,
    })
  );
});
adv.addEventListener("click", () => {
  // input field each, name, min, max, step(default: 1)
  const id = genid();
  const name = document.createElement("input");
  name.placeholder = "name";
  name.addEventListener("change", () => {
    const myidx = variables.findIndex((v) => v.id === id);
    variables[myidx].name = name.value;
  });
  const min = document.createElement("input");
  min.placeholder = "min";
  min.type = "number";
  min.addEventListener("change", () => {
    const myidx = variables.findIndex((v) => v.id === id);
    variables[myidx].min = parseFloat(min.value);
  });
  const max = document.createElement("input");
  max.placeholder = "max";
  max.type = "number";
  max.addEventListener("change", () => {
    const myidx = variables.findIndex((v) => v.id === id);
    variables[myidx].max = parseFloat(max.value);
  });
  const step = document.createElement("input");
  step.placeholder = "step";
  step.type = "number";
  step.value = 1;
  step.addEventListener("change", () => {
    const myidx = variables.findIndex((v) => v.id === id);
    variables[myidx].step = parseFloat(step.value);
  });
  const remove = document.createElement("button");
  remove.textContent = "Remove";
  remove.addEventListener("click", () => {
    variables = variables.filter((v) => v.id !== id);
    variablesDIV.removeChild(variablesDIV.querySelector(`[data-id="${id}"]`));
  });
  const div = document.createElement("div");
  div.dataset.id = id;
  div.append(name, min, max, step, remove);
  variablesDIV.appendChild(div);
  variables.push({ id, name, min: 0, max: 100, step: 1 });
});

calc.addEventListener("click", () => {
  const formula = input.value;
  const functionized = eval(
    `(${variables.map((x) => x.name).join(", ")}) => (${formula}) === true`
  );
  calc.setAttribute("disabled", "disabled");
  progress.value = 0;
  let total = 1;
  for (let i = 0; i < variables.length; i++) {
    total *= Math.floor(
      (variables[i].max - variables[i].min + 1) / variables[i].step
    );
  }
  progress.setAttribute("max", total);
  const results = [];

  let totalCalculated = 0;
  let progressT = 0;

  // has now variable value
  const stack = [];
  let i = 0;
  const stackHandler = () => {
    if (i == variables.length) {
      const func = functionized(...stack);
      if (func) {
        results.push([...stack]);
      }
      progressT++;
      totalCalculated++;
      if (progressT == report_timing) {
        progressT = 0;
        progress.value = totalCalculated;
        result.textContent = `${(
          Math.floor((totalCalculated / total) * 100000) / 1000
        ).toString()}%, ${results.length} success`;
      }
      i--;
      return;
    }

    if (stack.length == i) {
      stack.push(variables[i].min);
      i++;
      return;
    }
    // update
    stack[i] += variables[i].step;
    if (stack[i] > variables[i].max) {
      stack.pop();
      i--;
      return;
    }
    i++;
  };

  const interval = setInterval(() => {
    if (total <= totalCalculated) {
      clearInterval(interval);
      result.textContent = `${(
        Math.floor((totalCalculated / total) * 100000) / 1000
      ).toString()}%, ${results.length} success`;
      calc.removeAttribute("disabled");
      return;
    }

    for (let i = 0; i < 10000 && totalCalculated < total; i++) {
      stackHandler();
    }
  }, 0);
});
