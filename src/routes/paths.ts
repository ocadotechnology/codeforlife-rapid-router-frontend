import { path as _ } from "codeforlife/utils/router"

const paths = _("", {
  fruits: _("/fruits", {
    id: _("/:id"),
  }),
  level: _("/level/:id"),
})

export default paths
