export const Showdata_PL = (store, val) => {
    const newCounters = { ...store.state.counters };
    newCounters.showdata_pl = val;
    store.setState({ counters: newCounters });
};