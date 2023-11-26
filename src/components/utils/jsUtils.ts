import React, {EffectCallback} from "react";

/**
 * Creates an array of indices from begin to end (excluded)
 * @param begin The beginning index of the range
 * @param end The end index of the range, excluded
 */
export function range(begin: number, end: number): number[] {
	let arr = [];
	for (let i = begin; i < end; i++) {
		arr.push(i);
    }
    return arr;
}

/** Syntactic sugar */
export function doNothing(a?: any) {
}

/** Syntactic sugar */
export function equal<T>(a: T, b: T) {
	return a === b;
}

/** Equivalent of stopPropagation + preventDefault */
export function consumeEvent(e: React.UIEvent | UIEvent) {
	e.stopPropagation();
	e.preventDefault();
	console.log("Consumed event", e);
}

/**
 * Used in the return of useEffect so that the cleanup of the effect is always called even if the tab is closed
 * @param cleanup The cleanup to use
 */
export function safeCleanup(cleanup: Exclude<ReturnType<EffectCallback>, void>) {
	window.addEventListener("beforeunload", () => {
		cleanup();
		console.log("Safely cleaned up");
		alert("Cleaned up !");
	});

	return () => {
		cleanup();
		window.removeEventListener("beforeunload", cleanup);
	};
}


/**
 * Returns a hash code for a string.
 * (Compatible to Java's String.hashCode())
 *
 * The hash code for a string object is computed as
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using number arithmetic, where s[i] is the i th character
 * of the given string, n is the length of the string,
 * and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 *
 * @param {string} s a string
 * @return {number} a hash code value for the given string.
 */
export function hashcode(s: string) {
	let h = 0;
	for (let i = 0; i < s.length; i++) {
		h = Math.imul(31, h) + s.charCodeAt(i) | 0;
	}

	return h;
}

/**
 * Throws the error "Not implemented yet"
 */
export function notImplementedYet() {
	throw new Error("Not implemented yet");
}

/**
 * Syntactic sugar as the exclamation mark is easy to miss
 * @param b
 */
export function not(b: boolean): boolean {
	return !b;
}

const LOREM_IPSUM_SOURCE: string[] = (
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum non justo non sollicitudin. Aliquam interdum lectus mi, sit amet laoreet risus mollis et. Aliquam turpis nibh, aliquam non felis eu, ultrices feugiat massa. Donec quis mauris a nisl molestie rutrum vitae eget tellus. Maecenas feugiat porttitor pharetra. Pellentesque volutpat facilisis leo a congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nisl quam, iaculis quis venenatis id, mollis in nisl. Nulla sem risus, placerat a lacus sit amet, varius efficitur risus. Pellentesque rutrum nisl vel quam efficitur dictum" +
	"Maecenas lacus sem, efficitur id dolor sit amet, fermentum mattis nunc. Mauris egestas, nunc at luctus pellentesque, est odio lacinia erat, vel pulvinar nibh enim non risus. Morbi vitae erat congue, euismod velit pulvinar, mollis lacus. Fusce consequat ultricies gravida. Proin id mauris egestas, molestie lectus pellentesque, fringilla nisl. Sed luctus fermentum mollis. Integer et justo efficitur, fermentum massa ac, congue velit. Nunc tellus metus, sollicitudin in lobortis a, suscipit ut diam. Nulla metus erat, blandit non nunc sed, feugiat congue metus. Nulla quis augue mauris. Mauris rutrum porttitor leo, vitae egestas ligula porta eu. Donec massa augue, aliquet facilisis nisl non, posuere faucibus erat. Sed euismod commodo tristique" +
	"Fusce massa tortor, consequat sed mi eget, tristique tristique tellus. Integer vitae orci non dui ullamcorper varius. Nam est tortor, efficitur et eleifend nec, rhoncus sit amet elit. Sed eu tortor blandit, euismod arcu et, scelerisque nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In cursus nisl vitae nisi condimentum scelerisque. Curabitur mattis venenatis sapien, sed molestie quam tincidunt vel. Aenean eu lacus pharetra mi cursus varius. Sed iaculis elementum dolor ut gravida" +
	"Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam accumsan sapien ut velit molestie, ac egestas neque ultricies. Sed hendrerit, dui in ultrices rutrum, felis nisi varius lectus, vel interdum nisi metus facilisis felis. Mauris dapibus eleifend enim porttitor convallis. Nam interdum porttitor elit. Sed ut auctor neque, ut congue ligula. Etiam sit amet ante non lorem dapibus varius. Praesent rhoncus turpis sed quam blandit commodo" +
	"Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent et libero ac augue molestie pharetra. Curabitur faucibus est at ex dignissim, accumsan cursus nulla eleifend. Phasellus venenatis urna pulvinar tellus pharetra ornare. Pellentesque in arcu at elit dictum laoreet. Curabitur sollicitudin nibh sem, in commodo est scelerisque vel. Morbi nec rhoncus nibh, at dapibus nunc. Curabitur ut elit congue, congue tellus et, lobortis justo. Quisque sagittis dignissim mi, vel suscipit dolor dictum ut. Pellentesque vel mi aliquam, venenatis erat id, sollicitudin nisi. Fusce egestas mollis quam, et euismod arcu tempus sit amet. Pellentesque bibendum sapien nisi, ac iaculis augue efficitur quis. Nunc dui orci, consequat vel commodo vel, ullamcorper in lorem. Mauris sed vulputate massa" +
	"Duis et pretium sapien. Donec fringilla felis nec scelerisque aliquet. Donec venenatis congue leo tincidunt feugiat. Suspendisse rutrum rhoncus arcu, quis ultrices nisl. Nam vulputate turpis sed neque convallis, a aliquam arcu commodo. Pellentesque ac tortor congue, aliquam erat ac, dictum lacus. Fusce non diam felis. Donec nec nulla vitae mauris viverra volutpat in eu nisi. Nullam sit amet mollis justo" +
	"Vestibulum eget sem vulputate, facilisis neque eu, volutpat nisi. Praesent viverra arcu a erat rhoncus rutrum. Quisque ligula nunc, viverra eu venenatis vitae, cursus ut ligula. Aliquam eleifend sed nisi vel imperdiet. Vestibulum lacinia turpis sapien, et hendrerit risus fringilla sit amet. Donec egestas dui ut sem porttitor, eu suscipit turpis vulputate. Curabitur vestibulum lorem ac viverra sodales. Nam non elit cursus, egestas est ac, porttitor ligula" +
	"Sed rhoncus tellus eget erat gravida, dapibus pretium sem gravida. Nulla vel nisl velit. Ut erat nunc, gravida et augue nec, eleifend luctus dolor. Curabitur consequat finibus dolor. Integer risus tortor, semper id odio eget, varius condimentum diam. In auctor scelerisque purus sit amet vestibulum. Nullam sed vestibulum ipsum, sed eleifend ex. Aliquam auctor hendrerit pharetra. Phasellus et nisi et tortor efficitur dapibus. Vivamus ligula nisl, gravida et nisl scelerisque, facilisis feugiat turpis. Aliquam ut odio nec velit commodo porta vitae id arcu. Nam id nisl luctus, aliquam elit vel, sollicitudin metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla vel posuere dolor. Ut in purus cursus, faucibus magna fringilla, faucibus sem. Nulla facilisi" +
	"Sed pharetra ante arcu, vitae efficitur metus pretium nec. Aenean aliquam, nulla quis varius sagittis, tortor orci vehicula erat, sit amet pharetra ligula erat in sapien. Suspendisse dignissim eleifend velit in posuere. Pellentesque porta nulla eros, id imperdiet tellus egestas non. Praesent lacinia, leo interdum condimentum congue, nulla eros tempor augue, eu fermentum risus libero ut ante. Phasellus in elit sollicitudin, pharetra dolor et, fringilla quam. Proin condimentum justo ligula, nec feugiat erat placerat non. Pellentesque molestie tortor sit amet enim tempus, at mollis mi vulputate. Donec euismod semper dolor, id mollis lectus volutpat sed. In blandit efficitur pretium" +
	"Morbi euismod vel ex non facilisis. Proin convallis in dolor in egestas. Nullam laoreet elementum nulla, et maximus diam ullamcorper nec. Morbi a mauris dictum, elementum massa in, tempor nulla. Morbi egestas, lorem posuere accumsan pulvinar, risus eros congue nibh, vel auctor sapien felis eget purus. Sed vitae turpis magna. Phasellus egestas gravida nisi, at facilisis odio pellentesque id. Maecenas vestibulum semper finibus. Phasellus consectetur lorem tincidunt, varius massa et, dapibus quam. Pellentesque sagittis tellus eu lacus molestie, interdum posuere lectus placerat. Phasellus ultrices erat in erat pretium pulvinar. "
).split(" ");

export function loremIpsum(nbWords: number) {
	const choice = Math.floor(Math.random() * LOREM_IPSUM_SOURCE.length);
	return LOREM_IPSUM_SOURCE.slice(choice, choice + nbWords).join(" ");
}

export function randomLoremIpsum(minWordCount: number, maxWordCount: number) {
	const choice = Math.floor(Math.random() * (maxWordCount - minWordCount)) + minWordCount;
	return loremIpsum(choice);
}