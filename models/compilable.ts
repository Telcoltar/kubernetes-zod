
export interface Compilable<T> {
    compile(): T;
}

function compileRecordToArray<T extends Compilable<S>, S>(record: Record<string, T>): S[]{
        return Object.values(record).map((item) => item.compile());
}

export { compileRecordToArray };