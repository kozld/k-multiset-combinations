import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, Max } from 'class-validator';

// Количество букв в латинском алфавите.
const LatinAlphabetCount = 26;

// Порядковый номер элемента списка соответствует идентификатору типа в БД.
// Значение элемента списка соответствует количеству элементов данного типа.
export class GenerateCombinationsDto {
    @IsArray()
    @ApiProperty({
        description: `Массив чисел, в котором порядковый номер элемента
         соответствует идентификатору типа, а числовое значение - количеству
         элементов данного типа`,
        example: [1, 2, 1]
    })
    readonly items!: number[];

    @IsNumber() @Max(LatinAlphabetCount)
    @ApiProperty({
        description: 'Длина комбинации',
        example: 2
    })
    readonly length!: number;
}
