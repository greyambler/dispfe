export const Showdata_TSO = (store, val) => {
    const newCounters = { ...store.state.counters };
    newCounters.showdata_tso = val;
    store.setState({ counters: newCounters });
};