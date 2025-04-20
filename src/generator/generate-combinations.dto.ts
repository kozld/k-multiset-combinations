import { IsArray, IsNumber, Max } from 'class-validator';

// Количество букв в латинском алфавите.
const LatinAlphabetCount = 26;

export class GenerateCombinationsDto {
    @IsArray() readonly items: number[];
    @IsNumber() @Max(LatinAlphabetCount) readonly length: number;
}
