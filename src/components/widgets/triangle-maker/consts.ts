const uniformStyle = `width: 0;
height: 0;
border-style: solid;`
const triTemplate = [
  `border-width: 20px 30px 20px 0;
border-color: transparent #007bff transparent transparent;`,
  `border-width: 0 30px 30px 0;
border-color: transparent #007bff transparent transparent;`,
  `border-width: 30px 20px 0 20px;
border-color: #007bff transparent transparent transparent;`,
  `border-width: 30px 30px 0 0;
border-color: #007bff transparent transparent transparent;`,
  `border-width: 20px 0 20px 30px;
border-color: transparent transparent transparent #007bff;`,
  `border-width: 30px 0 0 30px;
border-color: transparent transparent transparent #007bff;`,
  `border-width: 0 20px 30px 20px;
border-color: transparent transparent #007bff transparent;`,
  `border-width: 0 0 30px 30px;
border-color: transparent transparent #007bff transparent;`,
]

export function getTriCssTemplate(index: number) {
  return uniformStyle + '\n' + triTemplate[index]
}