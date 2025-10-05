export function diffMsTs(start: Date, finish: Date) {
    return finish.getTime() - start.getTime(); // can be negative if finish < start
}
