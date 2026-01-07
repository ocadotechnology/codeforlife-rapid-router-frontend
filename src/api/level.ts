import {
  type ListArg,
  type ListResult,
  type Model,
  type RetrieveArg,
  type RetrieveResult,
  buildUrl,
  modelUrls,
  tagData,
} from "codeforlife/utils/api"

import { type BlockType } from "../blockly/blocks"
import api from "."

export type Level = Model<
  number,
  {
    name: string
    panel_count: 2 | 3
    blockly_toolbox_block_types: BlockType[]
  }
>

const levelUrls = modelUrls("levels/", "levels/<id>/")

export type RetrieveLevelResult = RetrieveResult<
  Level,
  "name" | "panel_count" | "blockly_toolbox_block_types"
>
export type RetrieveLevelArg = RetrieveArg<Level>

export type ListLevelsResult = ListResult<Level, "name">
export type ListLevelsArg = ListArg

const levelApi = api.injectEndpoints({
  endpoints: build => ({
    retrieveLevel: build.query<RetrieveLevelResult, RetrieveLevelArg>({
      query: id => ({
        url: buildUrl(levelUrls.detail, { url: { id } }),
        method: "GET",
      }),
      providesTags: tagData("Level"),
    }),
    listLevels: build.query<ListLevelsResult, ListLevelsArg>({
      query: search => ({
        url: buildUrl(levelUrls.list, { search }),
        method: "GET",
      }),
      providesTags: tagData("Level", { includeListTag: true }),
    }),
  }),
})

export default levelApi
// export const {
//   useRetrieveLevelQuery,
//   useLazyRetrieveLevelQuery,
//   useListLevelsQuery,
//   useLazyListLevelsQuery,
// } = levelApi

// TODO: uncomment the above and delete the below
export function useRetrieveLevelQuery(
  id: RetrieveLevelArg,
): RetrieveLevelResult {
  return {
    id,
    name: "example",
    panel_count: 3,
    blockly_toolbox_block_types: [
      "move_forwards",
      "turn_left",
      "turn_right",
      "turn_around",
      "wait",
      "deliver",
      "sound_horn",
      "road_exists",
      "traffic_light",
      "dead_end",
      "at_destination",
      "cow_crossing",
      "pigeon_crossing",
    ],
  }
}
