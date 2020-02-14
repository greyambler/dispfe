export const Showdata_TRK = (store, val) => {
    const newCounters = { ...store.state.counters };
    newCounters.showdata_trk = val;
    store.setState({ counters: newCounters });
};