export default class EventHelper {
  public static getEventId(): string {
    const currentUrl: string = window.location.pathname;
		const segments: string[] = currentUrl.split('/');
		const eventId: string | undefined = segments.pop() || segments.pop();

		return eventId as string;
  }
}
