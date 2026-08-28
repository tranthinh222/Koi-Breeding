import {
	BanknoteArrowUp,
	ChevronsUp,
	ClockArrowUp,
	CloudUpload,
	Coins,
	Earth,
	Fish,
	RulerDimensionLine,
	Trash2,
	Weight,
} from "lucide-react";
import type { IVariety, KoiShape, ScaleType } from "../../../types/backend";
import type { KoiDataForm, KoiFormErrors } from "./KoiForm";
import styles from "./KoiForm.module.css";

interface KoiFormBodyProps {
	form: KoiDataForm;
	isProcessing: boolean;
	errors: KoiFormErrors;
	varietyList: IVariety[];
	previewUrlState: [
		string | null,
		React.Dispatch<React.SetStateAction<string | null>>,
	];
	isDragActive: boolean;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
	onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
	handleRemoveImage: (e: React.MouseEvent) => void;
	onFieldChange: (value: React.SetStateAction<KoiDataForm>) => void;
	clearError: (fieldName: keyof KoiDataForm) => void;
}

const scaleTypeList = ["Wagoi", "Doitsu", "Ginrin"];
const shapeList = ["Standard", "Butterfly"];

function KoiFormBody({
	form,
	isProcessing,
	errors,
	varietyList,
	previewUrlState,
	isDragActive,
	fileInputRef,
	handleFileSelect,
	onDragOver,
	onDragLeave,
	onDrop,
	handleRemoveImage,
	onFieldChange,
	clearError,
}: KoiFormBodyProps) {
	return (
		<div className={styles.body}>
			<div className={styles.couple}>
				<div className={styles.firstCouple}>
					<div className={styles.textField}>
						<span className={styles.label}>Name</span>
						<div className={styles.inputWrapper}>
							<Fish size="30" color="#377394" />
							<input
								type="text"
								placeholder="ex. Kuchibeni Kohaku"
								value={form.name}
								disabled={isProcessing}
								className={`${styles.input} ${
									errors.name ? styles.inputError : ""
								}`}
								onChange={(e) => {
									onFieldChange((prev) => ({
										...prev,
										name: e.target.value,
									}));

									clearError("name");
								}}
							/>
						</div>
						{errors.name && (
							<span className={styles.error}>{errors.name}</span>
						)}
					</div>
					<div className={styles.textField}>
						<span className={styles.label}>Origin</span>
						<div className={styles.inputWrapper}>
							<Earth size="30" color="#096649" />
							<input
								type="text"
								placeholder="ex. Japan"
								value={form.origin}
								disabled={isProcessing}
								className={`${styles.input} ${
									errors.origin ? styles.inputError : ""
								}`}
								onChange={(e) => {
									onFieldChange((prev) => ({
										...prev,
										origin: e.target.value,
									}));

									clearError("origin");
								}}
							/>
						</div>
						{errors.origin && (
							<span className={styles.error}>
								{errors.origin}
							</span>
						)}
					</div>
				</div>
				<div
					className={`${styles.upload} ${isDragActive ? styles.dragActive : ""}`}
					onDragOver={onDragOver}
					onDragLeave={onDragLeave}
					onDrop={onDrop}
					onClick={() => fileInputRef.current?.click()}
				>
					<input
						type="file"
						accept="image/jpeg, image/jpg, image/png, image/svg+xml"
						hidden
						ref={fileInputRef}
						onChange={handleFileSelect}
					/>
					{previewUrlState[0] ? (
						<div className={styles.previewContainer}>
							<img
								src={previewUrlState[0]}
								alt="Preview"
								className={styles.previewImage}
							/>
							<button
								type="button"
								className={styles.removeImageButton}
								onClick={handleRemoveImage}
							>
								<Trash2 size="30" />
							</button>
						</div>
					) : (
						<>
							<CloudUpload
								size="100"
								className={styles.imageButton}
							/>
							<span>Choose a file or drag & drop it here</span>
							<span>
								JPEG, JPG, PNG and SVG formats, up to 10MB
							</span>
							<button
								type="button"
								className={styles.browseButton}
							>
								Browse File
							</button>
						</>
					)}
				</div>
			</div>

			<div className={styles.attributes}>
				<div className={styles.selectField}>
					<span>Variety</span>
					<select
						value={form.variety.id}
						disabled={isProcessing}
						onChange={(e) => {
							onFieldChange((prev) => ({
								...prev,
								variety: varietyList.find(
									(u) =>
										u.id ===
										Number.parseInt(e.target.value),
								) as IVariety,
							}));
						}}
					>
						{varietyList.map((variety, index) => (
							<option key={index} value={variety.id}>
								{variety.name}
							</option>
						))}
						{varietyList.length == 0 && (
							<option>Missing variety</option>
						)}
					</select>
				</div>
				<div className={styles.seperate} />
				<div className={styles.selectField}>
					<span>Scale Type</span>
					<select
						value={form.scaleType}
						disabled={isProcessing}
						onChange={(e) => {
							onFieldChange((prev) => ({
								...prev,
								scaleType:
									e.target.value.toUpperCase() as ScaleType,
							}));
						}}
					>
						{scaleTypeList.map((scaleType, index) => (
							<option key={index} value={scaleType}>
								{scaleType}
							</option>
						))}
					</select>
				</div>
				<div className={styles.seperate} />
				<div className={styles.selectField}>
					<span>Shape</span>
					<select
						value={form.shape}
						disabled={isProcessing}
						onChange={(e) => {
							onFieldChange((prev) => ({
								...prev,
								shape: e.target.value.toUpperCase() as KoiShape,
							}));
						}}
					>
						{shapeList.map((shape, index) => (
							<option key={index} value={shape}>
								{shape}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className={styles.couple}>
				<div className={styles.textField}>
					<span className={styles.label}>Base Max Length (cm)</span>
					<div className={styles.inputWrapper}>
						<RulerDimensionLine size="30" color="#b49429" />
						<input
							type="text"
							placeholder="ex. 90"
							value={form.baseMaxLength}
							disabled={isProcessing}
							className={`${styles.input} ${
								errors.baseMaxLength ? styles.inputError : ""
							}`}
							onChange={(e) => {
								onFieldChange((prev) => ({
									...prev,
									baseMaxLength: e.target.value,
								}));

								clearError("baseMaxLength");
							}}
						/>
					</div>
					{errors.baseMaxLength && (
						<span className={styles.error}>
							{errors.baseMaxLength}
						</span>
					)}
				</div>
				<div className={styles.textField}>
					<span className={styles.label}>
						Base Growth Rate (0.01 ~ 0.02)
					</span>
					<div className={styles.inputWrapper}>
						<ChevronsUp size="30" color="#44d131" />
						<input
							type="text"
							placeholder="ex. 0.015"
							value={form.baseGrowthRate}
							disabled={isProcessing}
							className={`${styles.input} ${
								errors.baseGrowthRate ? styles.inputError : ""
							}`}
							onChange={(e) => {
								onFieldChange((prev) => ({
									...prev,
									baseGrowthRate: e.target.value,
								}));

								clearError("baseGrowthRate");
							}}
						/>
					</div>
					{errors.baseGrowthRate && (
						<span className={styles.error}>
							{errors.baseGrowthRate}
						</span>
					)}
				</div>
			</div>

			<div className={styles.couple}>
				<div className={styles.textField}>
					<span className={styles.label}>Mid Age (days)</span>
					<div className={styles.inputWrapper}>
						<ClockArrowUp size="30" color="#aeb11a" />
						<input
							type="text"
							placeholder="ex. 300"
							value={form.midAge}
							disabled={isProcessing}
							className={`${styles.input} ${
								errors.midAge ? styles.inputError : ""
							}`}
							onChange={(e) => {
								onFieldChange((prev) => ({
									...prev,
									midAge: e.target.value,
								}));

								clearError("midAge");
							}}
						/>
					</div>
					{errors.midAge && (
						<span className={styles.error}>{errors.midAge}</span>
					)}
				</div>
				<div className={styles.textField}>
					<span className={styles.label}>
						Alpha Weight (0.000010 ~ 0.000020)
					</span>
					<div className={styles.inputWrapper}>
						<Weight size="30" />
						<input
							type="text"
							placeholder="ex. 0.000015"
							value={form.alphaWeight}
							disabled={isProcessing}
							className={`${styles.input} ${
								errors.alphaWeight ? styles.inputError : ""
							}`}
							onChange={(e) => {
								onFieldChange((prev) => ({
									...prev,
									alphaWeight: e.target.value,
								}));

								clearError("alphaWeight");
							}}
						/>
					</div>
					{errors.alphaWeight && (
						<span className={styles.error}>
							{errors.alphaWeight}
						</span>
					)}
				</div>
			</div>

			<div className={styles.couple}>
				<div className={styles.textField}>
					<span className={styles.label}>Base Price (Koins)</span>
					<div className={styles.inputWrapper}>
						<Coins size="30" color="#d0d236" />
						<input
							type="text"
							placeholder="ex. 150"
							value={form.basePrice}
							disabled={isProcessing}
							className={`${styles.input} ${
								errors.basePrice ? styles.inputError : ""
							}`}
							onChange={(e) => {
								onFieldChange((prev) => ({
									...prev,
									basePrice: e.target.value,
								}));

								clearError("basePrice");
							}}
						/>
					</div>
					{errors.basePrice && (
						<span className={styles.error}>{errors.basePrice}</span>
					)}
				</div>
				<div className={styles.textField}>
					<span className={styles.label}>
						Alpha Price (1.5 ~ 2.0)
					</span>
					<div className={styles.inputWrapper}>
						<BanknoteArrowUp size="30" />
						<input
							type="text"
							placeholder="ex. 1.50"
							value={form.alphaPrice}
							disabled={isProcessing}
							className={`${styles.input} ${
								errors.alphaPrice ? styles.inputError : ""
							}`}
							onChange={(e) => {
								onFieldChange((prev) => ({
									...prev,
									alphaPrice: e.target.value,
								}));

								clearError("alphaPrice");
							}}
						/>
					</div>
					{errors.alphaPrice && (
						<span className={styles.error}>
							{errors.alphaPrice}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

export default KoiFormBody;
