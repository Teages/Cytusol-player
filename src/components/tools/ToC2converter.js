function toC2converter (inputTexts) {
  let c1Data = getC1ChartData(inputTexts)

  let tempo = 60000000 / (120 / c1Data.pageSize)
  let page_count = (()=>{
    let maxTime = 0
    for (let note of c1Data.notes) {
      if (Number(note[1]) > maxTime) maxTime = Number(note[1])
    }
    console.log(maxTime, c1Data.pageShift, c1Data.pageSize)
    return Math.ceil((maxTime + c1Data.pageShift) / c1Data.pageSize) + 4
  })();

  console.log(page_count)

  let chart = {
    "format_version": 1,
    "time_base": 480,
    "start_offset_time": 0.0,
    "music_offset": c1Data.pageShift,
    "display_boundaries": false,
    "page_list": [
      {
        "start_tick": 0,
        "end_tick": 960,
        "scan_line_direction": 1
      }
    ],
    "tempo_list": [{
      "tick": 0,
      "value": tempo
    }],
    "event_order_list": [{
      "tick": 0,
      "event_list": [
        {
          "type": 3,
          "args": "5"
        }
      ]
    }],
    "note_list": [],
  }

  // init pages
  while (page_count > 0) {
    let lastPage = chart.page_list[chart.page_list.length - 1]
    chart.page_list.push({
        "start_tick": lastPage.end_tick,
        "end_tick": 960 + lastPage.end_tick,
        "scan_line_direction": -lastPage.scan_line_direction
      })
    page_count--;
  }

  // Init Notes 
  for (let noteData of c1Data.notes) {
    let noteTick = time2Tick(tempo, Number(noteData[1]) + c1Data.pageShift)
    chart.note_list.push({
      "page_index": Math.floor(noteTick / 960),
      "type": (noteData[3] > 0 ? 1 : 0),
      "id": Number(noteData[0]),
      "tick": noteTick,
      "x": Number(noteData[2]),
      "has_sibling": false,
      "hold_tick": time2Tick(tempo, noteData[3]),
      "next_id": 0,
      "is_forward": false
    })
  }

  chart.note_list.sort((a, b) => a.id - b.id)

  // Link Drags
  for (let linkData of c1Data.links) {
    linkData[0] = Number(linkData[0])
    if (isTypedNote(chart.note_list[linkData[0]], linkData[0])) return null;
    chart.note_list[linkData[0]].type = 3
    let lastNodeID = Number(linkData[0])
    for (let linkNodeId of linkData.slice(1)) {
      if (!linkNodeId) break;
      linkNodeId = Number(linkNodeId)
      if (isTypedNote(chart.note_list[linkNodeId], linkNodeId)) return null;
      chart.note_list[linkNodeId].type = 4
      chart.note_list[lastNodeID].next_id = linkNodeId
      lastNodeID = linkNodeId
    }
  }

  console.log(JSON.stringify(chart))

  return JSON.stringify(chart);

  function time2Tick(tempo, time) {
    // time = tick * tempo / 1000000 / this.chart.time_base
    return Math.floor(time * 480 * 1000000 / tempo)
  }

  function getC1ChartData(chartText) {
    let chartData = {}
    for (let lineText of chartText.split('\n')) {
      let lineData = lineText.split(/\s/)
      if (lineData && lineData[0]) {
        let lineDataType = lineData[0].toLocaleUpperCase()

        if (!chartData[lineDataType]) {
          chartData[lineDataType] = []
        }

        chartData[lineDataType].push(lineData.slice(1))

      }
    }
    return {
      version: Number(chartData.VERSION[0][0]),
      BPM: Number(chartData.BPM[0][0]),
      pageSize: Number(chartData.PAGE_SIZE[0][0]),
      pageShift: Number(chartData.PAGE_SHIFT[0][0]),
      notes: chartData.NOTE,
      links: chartData.LINK
    }
  }

  function isTypedNote(note, id = null) {
    if (!note) {
      console.error(`Error: Note(id:${id}) is not exist!`)
      return true
    }
    if (id && (note.id != id)) {
      console.error("Error: Note ID is not continuous!")
      return true
    }
    if (note.type != 0) {
      console.error(`Error: Note(id:${note.id}) have type ${noteTypeName(note.type)}(${note.type}), and should not belong to a new Drag.`)
      return true
    }
    console.log(`Note(id:${note.id}) is a drag`)
    return false
  }

  function noteTypeName(typeID) {
    let typeName = [
      'Click', 'Hold', '', 'Drag Head', 'Drag Child'
    ]
    return typeName[typeID]
  }
}

module.exports = toC2converter