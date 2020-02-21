import { Context, ContextFactoryOptions, ContextDefaultState } from './context';

import { pickProperties } from '../../utils/helpers';
import { inspectCustomData } from '../../utils/constants';

export type DialogFlagsContextType = 'dialog_flags';

export type DialogFlagsContextSubType =
'remove_dialog_flags'
| 'update_dialog_flags'
| 'set_dialog_flags';


const subTypes: Record<string, DialogFlagsContextSubType> = {
	10: 'remove_dialog_flags',
	11: 'update_dialog_flags',
	12: 'set_dialog_flags'
};

export interface IDialogFlagsContextPayload {
	peer_id: number;
	flags: number;
}

export type DialogFlagsContextOptions<S> =
	ContextFactoryOptions<number[], S>;

export class DialogFlagsContext<S = ContextDefaultState>
	extends Context<
	IDialogFlagsContextPayload,
	S,
	DialogFlagsContextType,
	DialogFlagsContextSubType
	> {
	public constructor(options: DialogFlagsContextOptions<S>) {
		const [eventId, peerId, flags] = options.payload;

		super({
			...options,

			type: 'dialog_flags',
			subTypes: [
				subTypes[eventId]
			],

			payload: {
				peer_id: peerId,
				flags
			}
		});
	}

	/**
	 * Checks that an important dialogue
	 */
	public get isImportant(): boolean {
		// eslint-disable-next-line no-bitwise
		return Boolean(this.flags & 1);
	}

	/**
	 * Checks that the unanswered dialog
	 */
	public get isUnanswered(): boolean {
		// eslint-disable-next-line no-bitwise
		return Boolean(this.flags & 2);
	}

	/**
	 * Returns the destination identifier
	 */
	public get peerId(): number {
		return this.payload.peer_id;
	}

	/**
	 * Returns the values of the flags
	 */
	public get flags(): number {
		return this.payload.flags;
	}

	/**
	 * Marks the conversation as answered or unchecked
	 */
	public markAsAnsweredConversation(params: object): Promise<number> {
		return this.vk.api.messages.markAsAnsweredConversation({
			...params,

			peer_id: this.peerId
		});
	}

	/**
	 * Marks the conversation as important or removes the mark
	 */
	public markAsImportantConversation(params: object): Promise<number> {
		return this.vk.api.messages.markAsImportantConversation({
			...params,

			peer_id: this.peerId
		});
	}

	/**
	 * Returns the custom data
	 */
	public [inspectCustomData](): object {
		return pickProperties(this, [
			'peerId',
			'flags',
			'isImportant',
			'isUnanswered'
		]);
	}
}
