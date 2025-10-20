import fruit from "./fruit"
import general from "./general"
import level from "./level"

const routes = (
  <>
    {general}
    {fruit}
    {level}
  </>
)

export default routes
export { default as paths } from "./paths"
