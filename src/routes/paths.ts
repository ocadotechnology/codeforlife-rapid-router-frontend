import { path as _ } from "codeforlife/utils/router"

const paths = _("", {
  level: _("/level", {
    id: _("/:id"),
  }),
})

export default paths
