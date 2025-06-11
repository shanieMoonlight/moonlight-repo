export function to_dd_MMM_YYYY(date?: Date | string | null): string {

    if (!date)
      return ''

    const dt = new Date(date)
    const day = dt.toLocaleString('default', { day: '2-digit' });
    const month = dt.toLocaleString('default', { month: 'short' });
    const year = dt.toLocaleString('default', { year: 'numeric' });

    return day + '-' + month + '-' + year;

  }