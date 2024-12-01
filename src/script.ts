type stringArray = string[];

type ChildrenType = Main | stringArray;

type Main = {
  tag: string;
  attrs: {
    class: string,
    src?: string,
    alt?: string,
    href?: string,
  };
  children: ChildrenType[]
}

async function getJson(dataFile: string):Promise<Main|undefined>{
  const data: Response = await fetch(dataFile);
  if (data) {
    const res:Main = await data.json();
    return res
  }else {
    return undefined
  }
}

function createElem(obj: Main) {
  const length = obj.children.length;
  const elem: HTMLElement = document.createElement(obj.tag);

  if (length === 0 || (length === 1 && typeof (obj.children[0]) === 'string')) {
    elem.textContent = typeof (obj.children[0]) === 'string' ? obj.children[0] : null;
    for (let entry of Object.entries(obj.attrs)) {
      if (entry[0] === 'class') {
        elem.className = entry[1];
      } else {
        elem.setAttribute(entry[0], entry[1]);
      }
    }
    return elem
  } else {
    const el = document.createElement(obj.tag);
    for (let subChild of obj.children) {
       if (typeof subChild === 'object' && 'tag' in subChild) {
        el.append(createElem(subChild as Main));
      }
    }
    return el
  }
}

getJson('data.json').then(res => {
  if (res) {
    const result = createElem(res);
    document.body.prepend(result);
  }
});




